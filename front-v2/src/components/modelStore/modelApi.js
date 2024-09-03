import axios from "axios";
import utils from "@/utils/CommonUtils";
const { notice } = utils;

const requestList = new Set();

const ModelInstance = axios.create({
  baseURL: '/model',
  timeout: 200000,
})

// ModelInstance.interceptors.request.use((config) => {
//   //const token = getToken();
//   const token = "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiYWRtaW4iLCJuYW1lIjoi566h55CG5ZGYIiwiaWQiOm51bGwsImV4cCI6MTcyMTc0MDg3OCwiZW1haWwiOiJuaHJpX2FkbWluQDE2My5jb20ifQ.tEMP3dapCQpsbq_iXEa9MDlNhGffGBBRTPcNihNgkShlSbei4Pd5guamSHrGkLrYp7W3kQ-nQEu-jqu8BsFu7Q"
//   const flag = config.headers["debounce"];
//   (config.headers.Authorization = `Bearer ${token}`),
//     (config.cancelToken = new axios.CancelToken((e) => {
//       const cancelRequest = () => {
//         let url = (config.baseURL) + config.url;
//         e(url);
//       };

//       if (flag === "true") {
//         requestList.has(config.url + JSON.stringify(config.data))
//           ? cancelRequest()
//           : requestList.add(config.url + JSON.stringify(config.data));
//       }
//     }));
//   return config;
// });

ModelInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    // const token = sessionStorage.getItem('token');
    if (token) {
      // config.headers['Authorization'] = `Bearer ${token}`;
      config.headers.token = `${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const get = (
  url,
  debounce,
  params
) => {
  return ModelInstance.get(url, {
    headers: {
      debounce: debounce ? "true" : "false",
    },
    params: params,
  });
};

export const getBlob = (
  url,
  debounce,
  params
) => {
  return ModelInstance.get(url, {
    headers: {
      debounce: debounce ? "true" : "false",
    },
    params: params,
    responseType: 'blob'
  });
};

export const post = (
  url,
  debounce,
  data
) => {
  return ModelInstance.post(url, data, {
    headers: {
      debounce: debounce ? "true" : "false",
    },
  });
};

export const del = (
  url,
  debounce
) => {
  return ModelInstance.delete(url, {
    headers: {
      debounce: debounce ? "true" : "false",
    },
  });
};

export const patch = (
  url,
  debounce,
  data
) => {
  return ModelInstance.patch(url, data, {
    headers: {
      debounce: debounce ? "true" : "false",
    },
  });
};


export default class ModelRequest {

  /**
   * @param {Omit<DataListType, "createTime" | "updateTime" | "download" | "watch">} jsonData
   */
  static async addDataList(jsonData) {
    return await post(`/dataList/addDataList`, true, jsonData);
  }

  /**
   * @param {{
   *   page: number;
   *   size: number;
   *   titleKeyword: string;
   *   property: string;
   *   flag: boolean;
   *   type: string;
   * }} jsonData
   */
  static async fuzzyQueryDataList(jsonData) {
    return await post(`/dataList/fuzzyQuery`, true, jsonData);
  }

  /**
   * @param {string} dataListId
   */
  static async findFiles(dataListId) {
    return await get(`/dataList/findFiles/${dataListId}`, true);
  }

  /**
   * @param {Omit<DataListType, "createTime" | "updateTime" | "download" | "watch">} jsonData
   */
  static async updateDataList(jsonData) {
    return await patch(`/dataList/updateDataList`, true, jsonData);
  }

  /**
   * @param {string} dataListId
   */
  static async deleteDataList(dataListId) {
    return await del(`/dataList/deleteDataList/${dataListId}`, true);
  }

  /**
   * @param {string} visualId
   */
  static async getCoordinates(visualId) {
    return await get(`/visual/getCoordinates/${visualId}`, true);
  }

  /**
   * @param {string} id
   */
  static async getAnalysisGeoJson(id) {
    return await get(`/visual/getAnalysisGeoJson/${id}`, true);
  }

  /**
   * @param {string} visualId
   */
  static async getContent(visualId) {
    return await get(`/visual/getContent/${visualId}`, true);
  }

  /**
   * @param {string} fileId
   */
  static async getSection(fileId) {
    return await get(`/visual/getSection/${fileId}`, true);
  }

  /**
   * @param {string} fileId
   */
  static async getSectionContrast(fileId) {
    return await get(`/visual/getSectionContrast/${fileId}`, true);
  }

  /**
   * @param {string} fileId
   */
  static async getSectionFlush(fileId) {
    return await get(`/visual/getSectionFlush/${fileId}`, true);
  }

  /**
   * @param {string} dataId
   * @param {number} number
   */
  static async getDataGroup(dataId, number) {
    return await get(`/browseHistory/getDataGroup/${dataId}/${number}`, true);
  }

  /**
   * @param {string} type
   * @param {string} station
   * @param {string} startTime
   * @param {string} endTime
   */
  static async getWaterLevelByStationAndTime(type, station, startTime, endTime) {
    return await get(
      `/waterway/getWaterLevelByStationAndTime/${type}/${station}/${startTime}/${endTime}`,
      true
    );
  }

  /**
   * @param {{ caseId: string; list: { fileId: string; dataListId: string; }[]; }} jsonData
   */
  static async addAnalysisData(jsonData) {
    return await post(`/analysis/addData`, true, jsonData);
  }

  /**
   * @param {{ id: string; projectName: string; avatar: string; }} jsonData
   */
  static async addAnalysisList(jsonData) {
    return await post('/analysis/addAnalysis', true, jsonData);
  }

  /**
   * @param {string} caseId
   */
  static async getData(caseId) {
    return await get(`/analysis/getData/${caseId}`, true);
  }

  /**
   * @param {string} caseId
   * @param {string} dataListId
   * @param {string} fileId
   */
  static async delData(caseId, dataListId, fileId) {
    return await del(`/analysis/delData/${caseId}/${dataListId}/${fileId}`, true);
  }

  /**
   * @param {{ geoJson: any; caseId: string; fileName: string; visualType: string; }} jsonData
   */
  static async addDraw(jsonData) {
    return await post(`/analysis/addDraw`, true, jsonData);
  }

  /**
   * @param {string} id
   */
  static async delAnalysisResult(id) {
    return await del(`/analysis/delAnalysisResult/${id}`, true);
  }

  /**
   * @param {{ dem-id: string; section-geometry: geoJson;}} jsonData
   */
  static async calculateSectionView(jsonData) {
    return await post(`/taskNode/start/riverbedEvolution/calculateSectionView`, true, jsonData);
  }

  /**
   * @param {{ bench-id: string; ref-id: string; section-geometry: geoJson;}} jsonData
   */
  static async calculateSectionContrast(jsonData) {
    return await post(`/taskNode/start/riverbedEvolution/calculateSectionContrast`, true, jsonData);
  }

  /**
   * @param {{ bench-id: string; ref-id: string; section-geometry: geoJson;}} jsonData
   */
  static async calculateRegionFlush(jsonData) {
    return await post(`taskNode/start/riverbedEvolution/calculateRegionFlush`, true, jsonData);
  }

  /**
   * @param {{ bench-id: string; ref-id: string; section-geometry: geoJson;}} jsonData
   */
  static async calculateRegionContour(jsonData) {
    return await post(`taskNode/start/riverbedEvolution/calculateRegionContour`, true, jsonData);
  }

  /**
   * @param {{ caseId: string; regionId: string; demId: string; deep: number; fileName: string; }} jsonData
   */
  static async calculateRiverVolume(jsonData) {
    return await post(`taskNode/start/riverbedEvolution/calculateRiverVolume`, true, jsonData);
  }

  /**
   * @param {{ id: string; name: string; }} jsonData
   */
  static async rename(jsonData) {
    return await patch(`/analysis/rename`, true, jsonData);
  }

  /**
   * @param {string} projectId
   * @param {string[]} list
   */
  static async updateLayer(projectId, list) {
    return await post(`/analysis/updateLayer/${projectId}`, true, list);
  }

  /**
   * @param {string} caseId
   */
  static async getLayersInfo(caseId) {
    return await get(`/analysis/getLayersInfo/${caseId}`, true);
  }

  /**
   * @param {string} type
   */
  static async findParameterByType(type) {
    return await get(`/analysis/findParameterByType/${type}`, true);
  }

  /**
   * @param {string} key
   */
  static async checkStatus(key) {
    return await get(`/taskNode/status/id?taskId=${key}`, true);
  }

  static async checkResult(key) {
    return await get(`taskNode/result/id?taskId=${key}`, true)
  }

  static async getResultData(type, caseid, name) {
    return await get(`/data/bankResource/down/modelServer/result/file/${type}?caseId=${caseid}&name=${name}`, true)
  }

  static async getDataList(datatype, bank) {
    // return await get(`/dataNode/bank/dataType?dataType=${datatype}&bank=${bank}`, true)
    return await get(`/data/bankResource/bank/dataType?dataType=${datatype}&bank=${bank}`, true)
  }

  /**
   * @param {string} projectId
   */
  static async getAllSection(projectId) {
    return await get(`/monitorVisual/getAllSection/${projectId}`, true);
  }

  /**
   * @param {string} projectId
   */
  static async getSectionElevation(projectId) {
    return await get(`/monitorVisual/getSectionElevation/${projectId}`, true);
  }

}


