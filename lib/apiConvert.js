const axios = require('axios');
const getURL = date => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${date}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;
const getQuotationAPI = url => axios.get(url);
const extractQuotation = res => res.data.value[0].cotacaoVenda;

const getToday = () => {
  const today = new Date();
  return today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear();
}

const getQuotation = (deps) => async() => {
  try {
    const { getToday, getURL, getQuotationAPI, extractQuotation } = deps;
    const today = getToday();
    const url = getURL(today);
    const res = await getQuotationAPI(url); // se essa promessa for rejeitada, o try para aqui
    const quotation = extractQuotation(res);
    return quotation;
  } catch(error) {
    return "";
  }
}

module.exports = {
  getQuotation: getQuotation({ getToday, getURL, getQuotationAPI, extractQuotation }),
  getQuotationAPI,
  extractQuotation, 
  getToday,
  getURL,
  pure: {
    getQuotation
  }
}
