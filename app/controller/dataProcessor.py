# from flask import render_template, Blueprint
from flask import Blueprint
data_blueprint = Blueprint('data',__name__)

import sys; import os
sys.path.append(os.path.abspath("./"))
sys.path.append(os.path.abspath("./dataset"))

import pandas as pd
import numpy as np
from itertools import islice

def read_data(file):
    df = pd.read_pickle(file)
    return df

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

def write_amplitudes_to_file(w_max, w_min, amplitudes, w_size=4, step=1, prefix=None):
    w_max.to_pickle("./dataset/" + prefix + "_max_w" + str(w_size) + "_s" + str(step) + ".pkl")
    w_min.to_pickle("./dataset/" + prefix + "_min_w" + str(w_size) + "_s" + str(step) + ".pkl")
    amplitudes.to_pickle("./dataset/" + prefix + "_heatmap_w" + str(w_size) + "_s" + str(step) + ".pkl")

def amplitude_into_bins(w_data, no_bins=10, type='ori'):
    w_min = (np.floor(w_data.min().min())).astype(int)
    w_max = (np.ceil(w_data.max().max())).astype(int)
    col_labels = w_data.columns.values
    # print(w_min, w_max)
    if type == 'ori':
        bins = pd.interval_range(start=w_min, end=w_max, periods=10, closed='left')
        pd.DataFrame(bins.to_tuples()).to_pickle("./dataset/ori_bins.pkl")
    elif type == 'pad':
        df = pd.read_pickle("./dataset/ori_bins.pkl")
        left=[]
        right=[]
        for v in df.values:
            left.append(v[0][0])
            right.append(v[0][1])
        bins = pd.IntervalIndex.from_arrays(left, right, closed="left")
    
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

    # write to file
    # amp_distr_list.to_pickle("./dataset/" + type + "_hm_wIdx_bins_" + str(no_bins) + ".pkl")

    # amp_index = []
    # for i in range(len(bins)):
    #     amp_index.append(str(np.round(bins[i].left, 2)) + "-" + str(np.round(bins[i].right, 2))) 
    # amp_distr.index = amp_index
    # print(amp_distr)


# for debug
if __name__ == "__main__":
    ori_file ='./dataset/dataframe_all_energy.pkl'
    s2_file = './dataset/sanitized_profile_best.pkl'
    s6_file = './dataset/sanitized_profile_best6.pkl'

    ori_hm = './dataset/ori_hm_wIdx_bins_10.pkl'

    df = read_data(ori_file)
    w = 5
    s = 3
    w_max, w_min, amplitudes = slide_window_amplitude(df, w, s)
    # print(amplitudes.shape)
    amplitude_into_bins(amplitudes)
    # write_amplitudes_to_file(w_max, w_min, amplitudes, w, s)
    
    # amplitude_into_bins(amplitudes)
    # print(df)
    # df1 = read_data("./dataset/heatmap_w5_s3.pkl")
    # df2 = read_data("./dataset/s_heatmap_w5_s3.pkl")
    # df3 = read_data("./dataset/s6_heatmap_w5_s3.pkl")
    # df1 = read_data("./dataset/data_amp_bins10.pkl")
    # print(df1)
    # left=[]
    # right=[]
    # for v in df.values:
    #     left.append(v[0][0])
    #     right.append(v[0][1])
    # print(left, right)
    # print(pd.IntervalIndex.from_arrays(left, right, closed="right"))
    # print(df.iloc[300])
    
    # print(amplitudes.iloc[0])
    
    # print(w_max, w_min)
    # print("origin............................")
    # amplitude_into_bins(df1)
    # print("s2................................")
    # amplitude_into_bins(df2)
    # print("s6................................")
    # amplitude_into_bins(df3)
