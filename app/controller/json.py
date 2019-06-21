from flask import Blueprint
from flask import request
data_blueprint = Blueprint('data',__name__)

import sys; import os
sys.path.append(os.path.abspath("./"))

import pandas as pd
import numpy as np
import json

file_map = {
    'ori': './db/dataframe_all_energy.pkl',
    'mean_k2': './db/energy_all_mean_n2.pkl',
    'median_k2': './db/energy_all_median_n2.pkl',
    "mean": './db/energy_all_mean.pkl',
    "median": './db/energy_all_median.pkl',
}

kvmap = {"Self-defined": 0, "Euclidean": 1, "LM": 2, "DM":3 }


#### process
def slide_window_amplitude(t_data, w_size=4, step=1):
    row_no, col_no = t_data.shape   
    wcol_no = np.int((col_no - w_size) / step + 1)
    i = np.arange(1, col_no, step)
    columns_values = t_data.columns.values[i[:wcol_no] - 1]
    # print(columns_values, len(columns_values))
    w_max = pd.DataFrame(np.zeros((row_no, wcol_no)), columns=columns_values)
    w_min = pd.DataFrame(np.zeros((row_no, wcol_no)), columns=columns_values)
    amplitudes = pd.DataFrame(np.zeros((row_no, wcol_no)), columns=columns_values)
    
    for row in t_data.itertuples():
        r_no = getattr(row, 'Index')
        for j in range(wcol_no):
            c_j = columns_values[j]
            # print(c_j)
            w_max.at[r_no, c_j] = max(row[i[j]:i[j]+w_size])
            w_min.at[r_no, c_j] = min(row[i[j]:i[j]+w_size])
            amplitudes.at[r_no, c_j] = max(row[i[j]:i[j]+w_size]) - min(row[i[j]:i[j]+w_size])
    
    # print(amplitudes)
    return w_max, w_min, amplitudes

def amplitude_into_bins(w_data, no_bins=10, type='ori'):
    w_min = (np.floor(w_data.min().min())).astype(int)
    w_max = (np.ceil(w_data.max().max())).astype(int)
    col_labels = w_data.columns.values
    # print(w_min, w_max)
    if type == 'ori':
        bins = pd.interval_range(start=w_min, end=w_max, periods=10, closed='left')
        pd.DataFrame(bins.to_tuples()).to_pickle("./db/ori_bins.pkl")
    else:
        df = pd.read_pickle("./db/ori_bins.pkl")
        left=[]
        right=[]
        for v in df.values:
            left.append(v[0][0])
            right.append(v[0][1])
        bins = pd.IntervalIndex.from_arrays(left, right, closed="left")
   
    # print(bins)
    amp_distr = pd.DataFrame(0, index=bins, columns=col_labels)
    data_bins = pd.DataFrame(0, index=w_data.index, columns=col_labels)
    for column in w_data:
        result = pd.cut(w_data[column], bins=bins, precision=1)
        amp_distr[column] = result.value_counts()
        data_bins[column] = result.to_frame()
    
    amp_distr_list = pd.DataFrame(columns=["time", "amp_interval",  "count", "instances"])
    no_bins = no_bins if no_bins else len(bins)
    time_arr = []
    amp_arr = []
    count_arr = []
    ins_arr = []
    for column in amp_distr:
        time_arr += [column] * no_bins
        amp_arr += amp_distr.index.values
        count_arr += [c for c in amp_distr[column]]
        ins_list = [[] for _ in range(no_bins)]
        for idx, value in enumerate(data_bins[column]):
            ins_list[bins.get_loc(value)].append(idx)
        ins_arr += ins_list
    
    str_amp_arr = [str(np.round(amp.left, 2)) + "-" + str(np.round(amp.right, 2)) for amp in amp_arr]
    amp_distr_list['time'] = time_arr
    amp_distr_list['amp_interval'] = str_amp_arr
    amp_distr_list['count'] = count_arr
    amp_distr_list['instances'] = ins_arr
    return amp_distr_list

def read_file(k, dm, rep):
    if not k:
        return pd.read_pickle(file_map['ori'])
    elif int(k) == 2:
        if rep.lower() == "mean":
            df = pd.read_pickle(file_map['mean_k2'])
        else:
            df = pd.read_pickle(file_map['median_k2'])
        return df[0][kvmap[dm]]
    else:
        if rep.lower() == "mean":
            df = pd.read_pickle(file_map['mean'])
        else:
            df = pd.read_pickle(file_map['median'])
        return df[0][int(k)][kvmap[dm]]

        

@data_blueprint.route('/data/lines')
def lines():
    k = request.args.get("k") if 'k' in request.args else None

    rep = request.args.get("rep") if 'rep' in request.args else None
    dist_metric = request.args.get("dist") if 'dist' in request.args else None

    df = read_file(k, dist_metric, rep)
    opacities = sort_global_amplitude(df)
    if k:
        groups = get_groups(df)
        df = df.drop_duplicates().sort_index()
        # print(df.shape)
    else:
        groups = []
    
    cols = [str(idx) for idx in df.index.values]
    line_df = df

    r = {
        "lines": line_df.to_json(orient="split"),
        "opacity": opacities,
        "groups": groups
        }
    return json.dumps(r)

@data_blueprint.route('/data/hm')
def heatmap():
    k = request.args.get("k") if 'k' in request.args else None

    rep = request.args.get("rep") if 'rep' in request.args else None
    dist_metric = request.args.get("dist") if 'dist' in request.args else None

    req_wsize = int(request.args.get("wsize")) if 'wsize' in request.args else 5
    req_step = int(request.args.get("step")) if 'step' in request.args else 3
    req_bins = int(request.args.get('bins')) if 'bins' in request.args else 10

    df = read_file(k, dist_metric, rep)
    # df = df.iloc[:90]
    w_max, w_min, amp = slide_window_amplitude(df, w_size=req_wsize, step=req_step)
    if not k:
        hm_df = amplitude_into_bins(amp, no_bins=req_bins)
    else:
        hm_df = amplitude_into_bins(amp, type="s")

    # print(hm_df)

    return hm_df.to_json(orient="records")

@data_blueprint.route('/data/stat')
def stat():
    k = request.args.get("k") if 'k' in request.args else None

    rep = request.args.get("rep") if 'rep' in request.args else None
    dist_metric = request.args.get("dist") if 'dist' in request.args else None

    df = read_file(k, dist_metric, rep)
    if k:
        groups = get_groups(df)
        df = df.drop_duplicates().sort_index()
    else:
        groups = []

    df_scatter = pd.DataFrame(columns=["index","mean", "std"])
    df_scatter["index"] = df.index.values
    df_scatter["mean"] = df.mean(axis=1).reset_index(drop=True)
    df_scatter["std"] = df.std(axis=1).reset_index(drop=True)
    
    r = {
        "dots": df_scatter.to_json(orient="records"),
        "groups": groups
    }
    return json.dumps(r)

@data_blueprint.route('/data/diff')
def diff():
    k = request.args.get("k") if 'k' in request.args else None

    rep = request.args.get("rep") if 'rep' in request.args else None
    dist_metric = request.args.get("dist") if 'dist' in request.args else None

    df = read_file(k, dist_metric, rep)
    if k:
        groups = get_groups(df)
        df = df.drop_duplicates().sort_index()
    else:
        groups = []

    df_maxmin = pd.DataFrame(columns=["index", "max", "min"])
    df_maxmin["index"] = df.index.values
    df_maxmin["max"] = df.max(axis=1).reset_index(drop=True)
    df_maxmin["min"] = df.min(axis=1).reset_index(drop=True)

    r = {
        "dots": df_maxmin.to_json(orient="records"),
        "groups": groups
    }
    return json.dumps(r)
    
def sort_global_amplitude(data, percentage=[0.01, 0.05, 0.1, 0.25, 0.5, 1], opacity=[1, 0.1, 0.1,0.1, 0.1, 0.1]):
    row_no, col_no = data.shape  
    # print (row_no, col_no)
    r_max, r_min = data.max(axis=1), data.min(axis=1)
    # r_max, r_min = max(data),min(data)
    r_diff = r_max - r_min
    r_diff = r_diff.sort_values(ascending=False)

    opacity_list = [0] * row_no
    portion = [round(i * row_no) for i in percentage]
    
    curr = 0
    portion_idx = 0
    curr_limit = portion[portion_idx]
    for i, v in r_diff.iteritems():
        curr += 1
        if curr > curr_limit:
            portion_idx += 1
            curr_limit = portion[portion_idx]
        
        opacity_list[i] = opacity[portion_idx]
    # print(opacity_list, len(opacity_list))
    return opacity_list

def get_groups(df):
    groups = {}
    
    i = 0
    curr_ptr = 0
    for index, row in df.iterrows():
        if not any(groups):
            groups[index] = [index]
            curr_ptr = index
            continue

        if row.equals(df.loc[curr_ptr]):
            groups[curr_ptr].append(index)
            groups[index] = [curr_ptr]
        else:
            groups[index] = [index]
            curr_ptr = index
    return groups

def slide_window_amplitude(t_data, w_size=4, step=1):
    row_no, col_no = t_data.shape   
    wcol_no = np.int((col_no - w_size) / step + 1)
    i = np.arange(1, col_no, step)
    columns_values = t_data.columns.values[i[:wcol_no] - 1]
    # print(columns_values, len(columns_values))
    w_max = pd.DataFrame(np.zeros((row_no, wcol_no)), columns=columns_values)
    w_min = pd.DataFrame(np.zeros((row_no, wcol_no)), columns=columns_values)
    amplitudes = pd.DataFrame(np.zeros((row_no, wcol_no)), columns=columns_values)
    
    for row in t_data.itertuples():
        r_no = getattr(row, 'Index')
        for j in range(wcol_no):
            c_j = columns_values[j]
            # print(c_j)
            w_max.at[r_no, c_j] = max(row[i[j]:i[j]+w_size])
            w_min.at[r_no, c_j] = min(row[i[j]:i[j]+w_size])
            amplitudes.at[r_no, c_j] = max(row[i[j]:i[j]+w_size]) - min(row[i[j]:i[j]+w_size])
    
    # print(amplitudes)
    return w_max, w_min, amplitudes


