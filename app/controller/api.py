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
        df = pd.read_pickle("./dataset/s2_amp_distr_same_bins10.pkl")
    elif req_type == 's6':
        df = pd.read_pickle("./dataset/s6_amp_distr_same_bins10.pkl")
    else: # origi
        df = pd.read_pickle("./dataset/amp_distr_bins10.pkl")
    
    # print(df)
    json_df = pd.DataFrame()
    t_col = df.columns.values
    for row in df.itertuples():
        intv = getattr(row, 'Index')
        json_df = json_df.append([[t_col[i],intv, row[i]] for i in range(1, len(row) - 1)]) 

    json_df.columns=["time", "amp_interval",  "count"]
    print(json_df)
    return json_df.to_json(orient="records")

@json_blueprint.route('/json/hl')
def hl():
    req_amp = request.args.get("amp")
    req_type = int(request.args.get("type"))
    req_t = int(request.args.get("t"))
    if req_type == "s2":
        df = pd.read_pickle("./dataset/max_w5_s3.pkl")
    elif req_type == "s6":
        df = pd.read_pickle("./dataset/data_amp_bins10.pkl")
    else:
        df = pd.read_pickle("./dataset/data_amp_bins10.pkl")
    
    # low, high = req_amp.split("-")
    # intv = pd.Interval(left=float(low), right=float(high), closed="left")
    
    
    result = df[df[req_t] == intv]
    idx = result.index
    cols = ["time"] + [str(i) for i in idx]
    # print(cols)
    df_orig = pd.read_pickle("./dataset/dataframe_all_energy.pkl")
    json_df = pd.concat([pd.DataFrame(df_orig.columns.values, dtype="int"), (df_orig.iloc[idx.values].T).reset_index(drop=True)], ignore_index=True, axis=1)
    json_df.columns = ['time'] + [str(i) for i in idx.values] 
    # print(json_df)
    return json_df.to_json(orient="records")

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
    # print(df)
    # idx = [264, 265, 254]
    df_mean = df.mean(axis=1)    
    df_std = df.std(1)
    # print(df_mean)
    df_scatter = pd.DataFrame(columns=["index","mean", "std"])
    df_scatter["index"] = df_mean.index.values
    df_scatter["mean"] = df_mean
    df_scatter["std"] = df_std

    # print(df_scatter.loc[idx, :])
    return df_scatter.loc[idx, :].to_json(orient="records")
    # return df_scatter.to_json(orient="records")

@json_blueprint.route('/json/scatter')
def scatter():
    # req_amp = request.args.get("amp_interval")
    # req_t = int(request.args.get("t"))
    req_type = request.args.get("type")

    if req_type == "s2":
        df_max = pd.read_pickle("./dataset/max_w5_s3.pkl")
        df_min = pd.read_pickle("./dataset/min_w5_s3.pkl")
    elif req_type == "s6":
        df_max = pd.read_pickle("./dataset/s_max_w5_s3.pkl")
        df_min = pd.read_pickle("./dataset/s_min_w5_s3.pkl")
    else:
        df_max = pd.read_pickle("./dataset/s_max_w5_s3.pkl")
        df_min = pd.read_pickle("./dataset/s_min_w5_s3.pkl")
    
    # if type(request.args.get("time")) != type(1):
    #     return json.dumps({"error": "params illegal"}), 404
    # else:
    #     req_time = int(request.args.get("time"))
        # df_max = pd.read_pickle("./dataset/max_w5_s3.pkl")
        # df_min = pd.read_pickle("./dataset/min_w5_s3.pkl")
    # req_time=[1]
    df_max = df_max.loc[idx[0], :]
    df_min = df_min.loc[idx[0], :]
    print(df_max)
    result = pd.DataFrame(columns=["index", "max", "min"])
    result["index"] = idx[0]
    result["max"] = df_max
    result["min"] = df_min
    # print(result)
    return result.to_json(orient="records")







@json_blueprint.route('/json/scatter_n2_best')
def scatter_ms():
    df = pd.read_pickle("./dataset/sanitized_profile_best.pkl")
    df_mean = df.mean(axis=1)    
    df_std = df.std(1)
    df_scatter = pd.DataFrame(columns=["mean", "std"])
    df_scatter["mean"] = df_mean
    df_scatter["std"] = df_std
    print(df_scatter.shape)
    return df_scatter.to_json(orient="records")

@json_blueprint.route('/json/line')
def all_energy():
    req_type = request.args.get("type")
    if req_type == "s2":
        df = pd.read_pickle("./dataset/sanitized_profile_best.pkl")
    elif req_type == 's6':
        df = pd.read_pickle("./dataset/sanitized_profile_best6.pkl")
    else: # origi
        df = pd.read_pickle(ori_file)
    
    df = df.sort_index().loc[idx, :]

    # print(df)

    cols = ['time'] + [str(idx) for idx in df.index.values]
    json_df = pd.concat([pd.DataFrame(df.columns.values, dtype="int"), (df.T).reset_index(drop=True)], ignore_index=True, axis=1)
    json_df.columns = ['time'] + [str(idx) for idx in df.index.values] 
    # json_df = json_df.loc[idx,:]
    # print(json_df)
    return json_df.to_json(orient="records")

@json_blueprint.route('/json/line1')
def all_energy1():
    df = pd.read_pickle("./dataset/sanitized_profile_best6.pkl")
    cols = ['time'] + [str(idx) for idx in df.index.values]
    json_df = pd.concat([pd.DataFrame(df.columns.values, dtype="int"), (df.T).reset_index(drop=True)], ignore_index=True, axis=1)
    json_df.columns = ['time'] + [str(idx) for idx in df.index.values] 
    return json_df.to_json(orient="records")


@json_blueprint.route('/json/one_line')
def one_line():
    df = pd.read_pickle("./dataset/dataframe_all_energy.pkl")
    df = df.iloc[0, :]
    json_df = pd.DataFrame(columns=["time", "power"])
    json_df['time'] = df.index.values
    json_df['power'] = df.T.reset_index(drop=True)
    # print(df.index.values.shape, df.T.shape)
    # print(df.index.values.shape, df.T.shape)
    return json_df.to_json(orient="records")