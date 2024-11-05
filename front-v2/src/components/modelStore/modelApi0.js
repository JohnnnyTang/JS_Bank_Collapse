import axios from "axios";
import utils from "@/utils/CommonUtils";
const { notice } = utils;

const requestList = new Set();

const ModelInstance = axios.create({
  baseURL: import.meta.env.VITE_MAP_TILE_SERVER2,
  timeout: 200000,
})

ModelInstance.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      requestList.delete(response.config.url + response.config.data);
    }, 600); //请求间隔600ms
    return response.data;
  },
  (err) => {
    if (axios.isCancel(err)) {
      console.log(err);
      notice("warning", "警告", "操作过于频繁");
      return null;
    } else {
      notice("error", "错误", "请求错误");
      requestList.delete(err.config.url + err.config.data);
      return err.data;
    }
  }
);

ModelInstance.interceptors.request.use((config) => {
  //const token = getToken();
  const token = "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiYWRtaW4iLCJuYW1lIjoi566h55CG5ZGYIiwiZXhwIjoxNzIyMjM1NjU2LCJlbWFpbCI6Im5ocmlfYWRtaW5AMTYzLmNvbSJ9.3IPqmaxd0ahHECtT-vJXYOkT69geGqYQ8cPrirfRptTB6QFluG4Sk_JoG8ECVvcl5eWcIP_LG51LdXoDoUXrNA"
  const flag = config.headers["debounce"];
  (config.headers.Authorization = `Bearer ${token}`),
    (config.cancelToken = new axios.CancelToken((e) => {
      const cancelRequest = () => {
        let url = (config.baseURL) + config.url;
        e(url);
      };

      if (flag === "true") {
        requestList.has(config.url + JSON.stringify(config.data))
          ? cancelRequest()
          : requestList.add(config.url + JSON.stringify(config.data));
      }
    }));
  return config;
});

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
   * @param {FormData} formData
   */
  static async multipartUpload(formData) {
    return await post(`/project/multipartUpload`, false, formData);
  }

  /**
   * @param {{ key: string; total: number }} jsonData
   */
  static async mergeMultipartFile(jsonData) {
    return await post(`/project/mergeMultipartFile`, true, jsonData);
  }

  /**
   * @param {FormData} formData
   */
  static async uploadAvatar(formData) {
    return await post(`/project/uploadAvatar`, true, formData);
  }

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
   * @param {number} size
   */
  static async getHot(size) {
    return await get(`/dataList/getHot/${size}`, true);
  }

  /**
   * @param {number} size
   */
  static async getIdAndDataListName(size) {
    return await get(`/dataList/getIdAndDataListName/${size}`, true);
  }

  /**
   * @param {string} id
   */
  static async getFileInfo(id) {
    return await get(`/dataList/getFileInfo/${id}`, true);
  }

  /**
   * @param {string} id
   */
  static async addWatchCount(id) {
    return await patch(`/dataList/addWatchCount/${id}`, true);
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
   * @param {string} dataListId
   */
  static async getStationInfoByDataListId(dataListId) {
    return await get(`/dataList/getStationInfoByDataListId/${dataListId}`, true);
  }

  /**
   * @param {string} type
   * @param {string} id
   * @param {number} size
   * @param {number} page
   */
  static async getSimilarData(type, id, size, page) {
    return await get(`/dataList/getSimilarData/${type}/${id}/${size}/${page}`, true);
  }

  /**
   * @param {{ dataListId: string; fileIdList: string[] }} jsonDta
   */
  static async addRelational(jsonDta) {
    return await post(`/relational/addRelational`, true, jsonDta);
  }

  /**
   * @param {{ dataListId: string; fileIdList: string[] }} jsonData
   */
  static async updateRelational(jsonData) {
    return await patch(`/relational/updateRelational`, true, jsonData);
  }

  /**
   * @param {string} id
   */
  static async getSandContent(id) {
    return await get(`/visual/getSandContent/${id}`, true);
  }

  /**
   * @param {string} id
   */
  static async getSuspension(id) {
    return await get(`/visual/getSuspension/${id}`, true);
  }

  /**
   * @param {string} id
   */
  static async getRateDirection(id) {
    return await get(`/visual/getRateDirection/${id}`, true);
  }

  /**
   * @param {string} id
   */
  static async getSalinity(id) {
    return await get(`/visual/getSalinity/${id}`, true);
  }

  /**
   * @param {string} id
   */
  static async getFlowSand_Z(id) {
    return await get(`/visual/getFlowSand_Z/${id}`, true);
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
   * @param {{ type: string; keyword: string; page: number; size: number }} jsonData
   */
  static async pageList(jsonData) {
    return await post(`/waterway/pageList`, true, jsonData);
  }

  /**
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   */
  static async getBuoyByBox(top, right, bottom, left) {
    return await get(
      `/waterway/getBuoyByBox/${top}/${right}/${bottom}/${left}`,
      false
    );
  }

  /**
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   * @param {string} startTime
   * @param {string} endTime
   */
  static async getShipInfoByBoxAndTime(top, right, bottom, left, startTime, endTime) {
    return await get(
      `/waterway/getShipInfoByBoxAndTime/${top}/${right}/${bottom}/${left}/${startTime}/${endTime}`,
      false
    );
  }

  /**
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   */
  static async queryBoxShip(top, right, bottom, left) {
    return await get(
      `/waterway/queryBoxShip/${top}/${right}/${bottom}/${left}`,
      true
    );
  }


  /**
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   */
  static async getAnchorInfoByBox(top, right, bottom, left) {
    return await get(
      `/waterway/getAnchorInfoByBox/${top}/${right}/${bottom}/${left}`,
      false
    );
  }

  /**
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   */
  static async getParkInfoByBox(top, right, bottom, left) {
    return await get(
      `/waterway/getParkInfoByBox/${top}/${right}/${bottom}/${left}`,
      false
    );
  }

  static async getAllBridgeInfo() {
    return await get(`/waterway/getAllBridgeInfo`, true);
  }

  static async getMeteorology() {
    return await get(`/waterway/getMeteorology`, true);
  }

  /**
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   */
  static async getStationByBox(top, right, bottom, left) {
    return await get(
      `/waterway/getStationByBox/${top}/${right}/${bottom}/${left}`,
      false
    );
  }

  static async getAllStation() {
    return await get(`/waterway/getAllStation`, true);
  }

  /**
   * @param {{ page: number; size: number; keyword: string; }} jsonData
   */
  static async pageQueryAnalysis(jsonData) {
    return await post(`/analysis/pageQuery`, true, jsonData);
  }

  /**
   * @param {string} caseId
   */
  static async getAnalysisResult(caseId) {
    return await get(`/analysis/getAnalysisResult/${caseId}`, true);
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
   * @param {string} id
   */
  static async deleteAnalysisCase(id) {
    return await del(`/analysis/deleteAnalysisCase/${id}`, true);
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
   * @param {{ caseId: string; sectionId: string; demId: string; fileName: string; }} jsonData
   */
  static async addSection(jsonData) {
    return await post(`/analysis/addSection`, true, jsonData);
  }

  /**
   * @param {{ caseId: string; sectionId: string; demList: string[]; fileName: string; }} jsonData
   */
  static async addSectionCompare(jsonData) {
    return await post(`/analysis/addSectionCompare`, true, jsonData);
  }

  /**
   * @param {{ caseId: string; sectionId: string; benchmarkId: string; referId: string; fileName: string; }} jsonData
   */
  static async addSectionFlush(jsonData) {
    return await post(`/analysis/addSectionFlush`, true, jsonData);
  }

  /**
   * @param {{ caseId: string; regionId: string; benchmarkId: string; referId: string; fileName: string; }} jsonData
   */
  static async addRegionFlush(jsonData) {
    return await post(`/analysis/addRegionFlush`, true, jsonData);
  }

  /**
   * @param {{ caseId: string; benchmarkId: string; referId: string; fileName: string; }} jsonData
   */
  static async addElevationFlush(jsonData) {
    return await post(`/analysis/addElevationFlush`, true, jsonData);
  }

  /**
   * @param {{ caseId: string; benchmarkId: string; referId: string; fileName: string; }} jsonData
   */
  static async addFlushContour(jsonData) {
    return await post(`/analysis/addFlushContour`, true, jsonData);
  }

  /**
   * @param {{ caseId: string; demId: string; fileName: string; }} jsonData
   */
  static async addSlope(jsonData) {
    return await post(`/analysis/addSlope`, true, jsonData);
  }

  /**
   * @param {{ caseId: string; regionId: string; demId: string; deep: number; fileName: string; }} jsonData
   */
  static async computeVolume(jsonData) {
    return await post(`/analysis/computeVolume`, true, jsonData);
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
  static async checkState(key) {
    return await get(`/analysis/checkState/${key}`, true);
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

  /**
   * @param {string} projectId
   */
  static async getFlux(projectId) {
    return await get(`/monitorVisual/getFlux/${projectId}`, true);
  }

  /**
   * @param {string} projectId
   */
  static async getSubstrate(projectId) {
    return await get(`/monitorVisual/getSubstrate/${projectId}`, true);
  }

  /**
   * @param {string} projectId
   */
  static async getSpeedOrientationNameAndType(projectId) {
    return await get(
      `/monitorVisual/getSpeedOrientationNameAndType/${projectId}`,
      false
    );
  }

  /**
   * @param {string} projectId
   * @param {string} name
   * @param {string} type
   */
  static async getSpeed(projectId, name, type) {
    return await get(
      `/monitorVisual/getSpeed/${projectId}/${name}/${type}`,
      true
    );
  }

  /**
   * @param {string} projectId
   * @param {string} name
   * @param {string} type
   */
  static async getOrientation(projectId, name, type) {
    return await get(
      `/monitorVisual/getOrientation/${projectId}/${name}/${type}`,
      true
    );
  }

  /**
   * @param {string} projectId
   */
  static async getSandTansport(projectId) {
    return await get(`/monitorVisual/getSandTransport/${projectId}`, true);
  }

  /**
   * @param {string} projectId
   */
  static async getSandContentClass(projectId) {
    return await get(`/monitorVisual/getSandContentClass/${projectId}`, true);
  }

  /**
 * @param {string} projectId
 * @param {string} name
 */
  static async getSandContentValue(projectId, name) {
    return await get(
      `/monitorVisual/getSandContentValue/${projectId}/${name}`,
      true
    );
  }

  /**
   * @param {string} projectId
   */
  static async getFloatPoint(projectId) {
    return await get(`/monitorVisual/getLocusPoint/${projectId}`, false);
  }

  /**
   * @param {string} projectId
   * @param {string} pointName
   */
  static async getFloatPointTable(projectId, pointName) {
    return await get(
      `/monitorVisual/getLocusTable/${projectId}/${pointName}`,
      false
    );
  }

  /**
   * @param {string} projectId
   * @param {string} pointName
   */
  static async getFloatPointShape(projectId, pointName) {
    return await get(
      `/monitorVisual/getLocusShape/${projectId}/${pointName}`,
      false
    );
  }

  /**
   * @param {string} parentId
   */
  static async findByFolderId(parentId) {
    return await get(`/files/findByFolderId/${parentId}`, true);
  }

  /**
   * @param {{ folderName: string; parentId: string; }} jsonData
   */
  static async addFolder(jsonData) {
    return await post(`/files/addFolder`, true, jsonData);
  }

  /**
   * @param {string} visualId
   */
  static async getVisualFileByVisualId(visualId) {
    return await get(`/files/getVisualFileByVisualId/${visualId}`, true);
  }

  /**
   * @param {{ files: string[]; folders: string[]; }} jsonData
   */
  static async deleteFilesOrFolders(jsonData) {
    return await post(`/files/deleteFilesOrFolders`, true, jsonData);
  }

  static async getUploadRecord() {
    return await get(`/files/getUploadRecord`, true);
  }

  /**
   * @param {FormData} formData
   */
  static async uploadChunks(formData) {
    return await post(`/files/uploadChunks`, false, formData);
  }

  /**
   * @param {{ parentId: string; id: string; total: number; fileName: string; }} jsonDta
   */
  static async mergeChunks(jsonDta) {
    return post(`/files/mergeChunks`, false, jsonDta);
  }

  static async delAllRecord() {
    return del(`/files/delAllRecord`, true);
  }

  /**
   * @param {string} id
   */
  static async delRecord(id) {
    return del(`/files/delRecord/${id}`, true);
  }

  /**
   * @param {string} id
   */
  static async cancelVisualBind(id) {
    return del(`/files/cancelVisualBind/${id}`, true);
  }

  /**
   * @param {string} id
   * @param {number} total
   * @param {string} type
   * @param {string} name
   */
  static async visualFileMerge(id, total, type, name) {
    return await post(
      `/files/visualFileMerge/${id}/${total}/${type}/${name}`,
      true
    );
  }

  /**
   * @param {{ id: string; fileName: string; type: string; srid: string; coordinates: number[][]; view: { zoom: number; center: number[]; } | null; }} jsonData
   */
  static async bindVisualData(jsonData) {
    return await post(`/files/bindVisualData`, true, jsonData);
  }

  static async getPredictionStation() {
    return await get(`/waterway/getPredictionStation`, true);
  }

  static async getAllPredictionValue() {
    return await get(`/waterway/getAllPredictionValue`, true);
  }

  static async getRegionTideStation() {
    return await get(
      `/waterway/getStationByBox/32.382/122.236/30.848/118.460`,
      true
    );
  }

}


