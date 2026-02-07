import axios from "axios"

let baseUrl = "/api/phonebook";

export const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const postEntry = async (data) => {
  const response = await axios.post(baseUrl, data);
  return response.data
}

export const deleteEntry = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
}

export const patchEntry = async (id, data) => {
  const response = await axios.patch(`${baseUrl}/${id}`, data);
  return response.data;
}