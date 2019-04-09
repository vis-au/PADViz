from flask import Blueprint
from flask import request
json_blueprint = Blueprint('json',__name__)

import sys; import os
sys.path.append(os.path.abspath("./"))
sys.path.append(os.path.abspath("./dataset"))

import pandas as pd
import numpy as np

import json


@json_blueprint.route('/json/heatmap')
def read_heatmap():
    req_type = request.args.get("type")
    req_wsize = request.args.get("wsize")
    req_step = request.args.get("step")
    req_k = request.args.get("k")
    # print(req_type)
    if req_type == "santinized":
        df = pd.read_pickle("./dataset/s_amp_distr_bins10.pkl")
    else: # origi
        df = pd.read_pickle("./dataset/amp_distr_bins10.pkl")
    
    # print(df)
    json_df = pd.DataFrame()
    t_col = df.columns.values
    for row in df.itertuples():
        intv = getattr(row, 'Index')
        json_df = json_df.append([[t_col[i],intv, row[i]] for i in range(1, len(row) - 1)]) 
    json_df.columns=["time", "amp_interval",  "count"]
    # print(json_df)
    return json_df.to_json(orient="records")

@json_blueprint.route('/json/hl')
def hl():
    req_amp = request.args.get("amp")
    req_t = int(request.args.get("t"))

    low, high = req_amp.split("-")
    intv = pd.Interval(left=float(low), right=float(high), closed="left")
    df = pd.read_pickle("./dataset/data_amp_bins10.pkl")
    
    result = df[df[req_t] == intv]
    idx = result.index
    cols = ["time"] + [str(i) for i in idx]
    # print(cols)
    df_orig = pd.read_pickle("./dataset/dataframe_all_energy.pkl")
    json_df = pd.concat([pd.DataFrame(df_orig.columns.values, dtype="int"), (df_orig.iloc[idx.values].T).reset_index(drop=True)], ignore_index=True, axis=1)
    json_df.columns = ['time'] + [str(i) for i in idx.values] 
    # print(json_df)
    return json_df.to_json(orient="records")

@json_blueprint.route('/json/scatter')
def scatter():
    req_amp = request.args.get("amp_interval")
    if type(request.args.get("time")) != type(1):
        return json.dumps({"error": "params illegal"}), 404
    else:
        req_time = int(request.args.get("time"))
        df_max = pd.read_pickle("./dataset/max_w5_s3.pkl")
        df_min = pd.read_pickle("./dataset/min_w5_s3.pkl")
        result = pd.DataFrame(columns=["max", "min"])
        result["max"] = df_max[req_time]
        result["min"] = df_min[req_time]
        # print(result)
        return result.to_json(orient="records")


@json_blueprint.route('/json/scatter_origin')
def scatter_mean_std():
    df = pd.read_pickle("./dataset/dataframe_all_energy.pkl")

    df_mean = df.mean(axis=1)    
    df_std = df.std(1)
    print(df_mean)
    df_scatter = pd.DataFrame(columns=["index","mean", "std"])
    df_scatter["index"] = df_mean.index.values
    df_scatter["mean"] = df_mean
    df_scatter["std"] = df_std
    return df_scatter.to_json(orient="records")

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
    df = pd.read_pickle("./dataset/dataframe_all_energy.pkl")
    cols = ['time'] + [str(idx) for idx in df.index.values]
    json_df = pd.concat([pd.DataFrame(df.columns.values, dtype="int"), (df.T).reset_index(drop=True)], ignore_index=True, axis=1)
    json_df.columns = ['time'] + [str(idx) for idx in df.index.values] 
    json_df = json_df.iloc[:30,:]
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