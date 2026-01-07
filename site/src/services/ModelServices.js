import { api } from './api';

/**
 * Função genérica para criar um registro
 * @param {string} url - O endpoint relativo (ex: '/user')
 * @param {object} data - Os dados a serem enviados
 */
export async function createRecord(url, data) {
  try {
    const response = await api.post(url, data);
    console.log("Record created:", response);
    return response;
  } catch (error) {
    console.error("Error creating record:", error);
    return null; // Mantendo o comportamento original de retornar null em erro
  }
}

/**
 * Função para enviar arquivo para o backend
 */
export async function uploadFileFrontend(url, file) {
  try {
    // O helper api.upload já cuida do FormData
    const result = await api.upload(url, file);
    return result;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

/**
 * Função genérica para listar registros
 */
export async function listRecords(url) {
  try {
    const response = await api.get(url);
    console.log("Records listed:", response);
    return response;
  } catch (error) {
    console.error("Error listing records:", error);
    return null;
  }
}

/**
 * Função genérica para atualizar registro
 */
export async function updateRecord(url, data) {
  try {
    const response = await api.put(url, data);
    console.log("Record updated:", response);
    return response;
  } catch (error) {
    console.error("Error updating record:", error);
    return null;
  }
}

/**
 * Função genérica para deletar registro
 */
export async function deleteRecord(url) {
  try {
    const response = await api.delete(url);
    console.log("Record deleted:", response);
    return response;
  } catch (error) {
    console.error("Error deleting record:", error);
    return null;
  }
}

/**
 * Retorna a URL base da API
 */
export function GetURL() {
  return api.baseUrl + "/";
}