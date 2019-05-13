from flask import Blueprint
from flask import request
json_blueprint = Blueprint('json',__name__)

import sys; import os
sys.path.append(os.path.abspath("./"))
# sys.path.append(os.path.abspath("./dataset"))

import pandas as pd
import numpy as np
import json


ori_file ='./dataset/dataframe_all_energy.pkl'

ori_hm = './dataset/ori_hm_wIdx_bins_10.pkl'
s2_hm = './dataset/s2_hm_wIdx_bins_10.pkl'
s6_hm = './dataset/s6_hm_wIdx_bins_10.pkl'

idx = [264, 265, 254]
idx = [256, 263, 266, 268, 269, 253, 254, 255]
##
## HEATMAP
##

@json_blueprint.route('/json/heatmap')
def read_heatmap():
    req_type = request.args.get("type")
    req_wsize = request.args.get("wsize")
    req_step = request.args.get("step")
    req_k = request.args.get("k")
    # print(req_type)
    if req_type == "s2":
        df = pd.read_pickle(s2_hm)
    elif req_type == 's6':
        df = pd.read_pickle(s6_hm)
    else: # origi
        df = pd.read_pickle(ori_hm)
    
    return df.to_json(orient="records")

##
## scatter
##

@json_blueprint.route('/json/stat')
def scatter_mean_std():
    req_type = request.args.get("type")

    if req_type == "s2":
        df = pd.read_pickle("./dataset/sanitized_profile_best.pkl")
    elif req_type == 's6':
        df = pd.read_pickle("./dataset/sanitized_profile_best6.pkl")
    else: # origi
        df = pd.read_pickle(ori_file)
    
    df = df.sort_index()
    df_mean = df.mean(axis=1)    
    df_std = df.std(1)
    # print(df_mean)
    df_scatter = pd.DataFrame(columns=["index","mean", "std"])
    df_scatter["index"] = df_mean.index.values
    df_scatter["mean"] = df_mean
    df_scatter["std"] = df_std

    return df_scatter.to_json(orient="records")

@json_blueprint.route('/json/amp')
def scatter():
    req_type = request.args.get("type")

    if req_type == "s2":
        df_max = pd.read_pickle("./dataset/s_max_w5_s3.pkl")
        df_min = pd.read_pickle("./dataset/s_min_w5_s3.pkl")
    elif req_type == "s6":
        df_max = pd.read_pickle("./dataset/s6_max_w5_s3.pkl")
        df_min = pd.read_pickle("./dataset/s6_min_w5_s3.pkl")
    else:
        df_max = pd.read_pickle("./dataset/max_w5_s3.pkl")
        df_min = pd.read_pickle("./dataset/min_w5_s3.pkl")
    
    # print(df_max)
    result = pd.DataFrame(columns=["time", "index", "max", "min"])
    no_idx = df_max.shape[0]
    time_arr = []
    index_arr = []
    max_arr = []
    min_arr = []
    for column in df_max:
        time_arr += [column] * no_idx
        index_arr += [ _ for _ in df_max.index]
        max_arr += [ _ for _ in df_max[column]]
        min_arr += [ _ for _ in df_min[column]]
    
    # print(len(time_arr), len(index_arr),len(min_arr),len(max_arr))
    result["time"] = time_arr
    result["index"] = index_arr
    result["max"] = max_arr
    result["min"] = min_arr
    # print(result)
    return result.to_json(orient="records")

##
## spaghetti
##

@json_blueprint.route('/json/line')
def all_energy():
    req_type = request.args.get("type")
    if req_type == "s2":
        df = pd.read_pickle("./dataset/sanitized_profile_best.pkl")
    elif req_type == 's6':
        df = pd.read_pickle("./dataset/sanitized_profile_best6.pkl")
    else: # origi
        df = pd.read_pickle(ori_file)

    # print(len(df))    
    df = df.sort_index()

    cols = ['time'] + [str(idx) for idx in df.index.values]
    json_df = pd.concat([pd.DataFrame(df.columns.values, dtype="int"), (df.T).reset_index(drop=True)], ignore_index=True, axis=1)
    json_df.columns = ['time'] + [str(idx) for idx in df.index.values] 
    # return json_df.to_json()
    return json_df.to_json(orient="records")

f_mean = "./datasets/energy_all_mean.pkl"
f_mean2 = "./datasets/energy_all_mean_n2.pkl"
f_median = "./datasets/energy_all_median.pkl"

def simpleComp(lst):
    d = lst.duplicated()
    idx = []
    # for i, v in d.iteritems():
    #     print(i, v)
    # for i in range(len(lst)):
    #     print(lst(i))

@json_blueprint.route('/json/hm')
def loadHeatMap():
    k = request.args.get("k") if 'k' in request.args else None
    rep = request.args.get("rep") if 'rep' in request.args else None
    dist_metric = request.args.get("dist") if 'dist' in request.args else None
    dfo = pd.read_pickle(ori_file)
    # print(dfo.shape)
    kvmap = {"Self-defined": 0, "Euclidean": 1, "LM": 2, "DM":3 }
    if rep.lower() == "mean":
        if int(k) == 2:
            df = pd.read_pickle(f_mean2)
            # print(df)
            
            df = df[0][kvmap[dist_metric]]
            simpleComp(df)
            df = df.sort_index()
        else:
            df = pd.read_pickle(f_mean)
            
            df = df[0][int(k)][kvmap[dist_metric]].sort_index()
    elif rep.lower() == "median":
        df = pd.read_pickle(f_median)
        df = df[0][int(k)][kvmap[dist_metric]].sort_index()
    

    # print(df)
    w_max, w_min, amp = slide_window_amplitude(df, 5, 3)
    hm_df = amplitude_into_bins(amp, type="s")
    # print(hm_df)

    #line
    cols = ['time'] + [str(idx) for idx in df.index.values]
    line_df = pd.concat([pd.DataFrame(df.columns.values, dtype="int"), (df.T).reset_index(drop=True)], ignore_index=True, axis=1)
    line_df.columns = ['time'] + [str(idx) for idx in df.index.values] 
    # return json_df.to_json()
    
    #stat
    df_mean = df.mean(axis=1)    
    df_std = df.std(1)
    # print(df_mean)
    df_scatter = pd.DataFrame(columns=["index","mean", "std"])
    df_scatter["index"] = df_mean.index.values
    df_scatter["mean"] = df_mean
    df_scatter["std"] = df_std
    # print(df_scatter)

    # max min
    df_maxmin = pd.DataFrame(columns=["time", "index", "max", "min"])
    no_idx = w_max.shape[0]
    time_arr = []
    index_arr = []
    max_arr = []
    min_arr = []
    for column in w_max:
        time_arr += [column] * no_idx
        index_arr += [ _ for _ in w_max.index]
        max_arr += [ _ for _ in w_max[column]]
        min_arr += [ _ for _ in w_min[column]]
    
    # print(len(time_arr), len(index_arr),len(min_arr),len(max_arr))
    df_maxmin["time"] = time_arr
    df_maxmin["index"] = index_arr
    df_maxmin["max"] = max_arr
    df_maxmin["min"] = min_arr
    # print(df_maxmin)

    r = {"hm": hm_df.to_json(orient="records"), "line": line_df.to_json(orient="records"), "stat": df_scatter.to_json(orient="records"), "maxmin": df_maxmin.to_json(orient="records")}
    # print(r)
    return json.dumps(r)


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
        pd.DataFrame(bins.to_tuples()).to_pickle("./dataset/ori_bins.pkl")
    else:
        df = pd.read_pickle("./dataset/ori_bins.pkl")
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
    # print(amp_distr_list)
    # write to file
    # amp_distr_list.to_pickle("./dataset/" + type + "_hm_wIdx_bins_" + str(no_bins) + ".pkl")

    # amp_index = []
    # for i in range(len(bins)):
    #     amp_index.append(str(np.round(bins[i].left, 2)) + "-" + str(np.round(bins[i].right, 2))) 
    # amp_distr.index = amp_index
    # print(amp_distr)