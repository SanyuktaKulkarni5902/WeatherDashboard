export const cleanCityName =(cityName)=>{
    return cityName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*\(.*?\)\s*/g, '');
}