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
    # df = pd.read_pickle("./dataset/dataframe_all_energy.pkl")
    # df = pd.read_pickle("./dataset/ori_bins.pkl")
    df = pd.read_pickle(file)
    # print(df)
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

def write_amplitudes_to_file(w_max, w_min, amplitudes, w_size=4, step=1, t_col=None):
    w_max.to_pickle("./dataset/s6_max_w" + str(w_size) + "_s" + str(step) + ".pkl")
    w_min.to_pickle("./dataset/s6_min_w" + str(w_size) + "_s" + str(step) + ".pkl")
    amplitudes.to_pickle("./dataset/s6_heatmap_w" + str(w_size) + "_s" + str(step) + ".pkl")
    # w_max.to_pickle("./dataset/max_w" + str(w_size) + "_s" + str(step) + ".pkl")
    # w_min.to_pickle("./dataset/min_w" + str(w_size) + "_s" + str(step) + ".pkl")
    # amplitudes.to_pickle("./dataset/heatmap_w" + str(w_size) + "_s" + str(step) + ".pkl")

def amplitude_into_bins(w_data, no_bins=10):
    w_min = (np.floor(w_data.min().min())).astype(int)
    w_max = (np.ceil(w_data.max().max())).astype(int)
    col_labels = w_data.columns.values
    # print(w_min, w_max)

    # bins = pd.interval_range(start=w_min, end=w_max, periods=10, closed='left') 
    df = pd.read_pickle("./dataset/ori_bins.pkl")
    left=[]
    right=[]
    for v in df.values:
        left.append(v[0][0])
        right.append(v[0][1])
    # print(left, right)
    bins = pd.IntervalIndex.from_arrays(left, right, closed="right")
    # print(type(bins))
    # print(bins.to_tuples())
    # pd.DataFrame(bins.to_tuples()).to_pickle("./dataset/ori_bins.pkl")

    amp_distr = pd.DataFrame(0, index=bins, columns=col_labels)
    data_bins = pd.DataFrame(0, index=w_data.index, columns=col_labels)
    # print(bins.round(2))
    for column in w_data:
        result = pd.cut(w_data[column], bins=bins, precision=1)
        # print(result.value_counts())
        amp_distr[column] = result.value_counts()
        data_bins[column] = result.to_frame()
    
    # print(data_bins.iloc[1])
    # print(w_data.iloc[1])
    amp_index = []
    for i in range(len(bins)):
        amp_index.append(str(np.round(bins[i].left, 2)) + "-" + str(np.round(bins[i].right, 2))) 
    amp_distr.index = amp_index
    # write to file
    amp_distr.to_pickle("./dataset/s6_amp_distr_same_bins" + str(no_bins) + ".pkl")
    data_bins.to_pickle("./dataset/s6_data_amp_same_bins" + str(no_bins) + ".pkl")


# for debug
if __name__ == "__main__":
    df = read_data("./dataset/amp_distr_bins10.pkl")
    df1 = read_data("./dataset/data_amp_bins10.pkl")
    print(df)
    print(df1)
    # left=[]
    # right=[]
    # for v in df.values:
    #     left.append(v[0][0])
    #     right.append(v[0][1])
    # print(left, right)
    # print(pd.IntervalIndex.from_arrays(left, right, closed="right"))
    # print(df.iloc[300])
    # w = 5
    # s = 3
    # w_max, w_min, amplitudes = slide_window_amplitude(df, w, s)
    # print(amplitudes.iloc[0])
    # write_amplitudes_to_file(w_max, w_min, amplitudes, w, s)
    # print(w_max, w_min)
    # amplitude_into_bins(amplitudes)