const api = require('./apiConvert');
const axios = require('axios');

jest.mock('axios');

test('getQuotationAPI', () => {
  const res = {
    data: {
      value: [
        { cotacaoVenda: 5.6008 }
      ]
    }
  }

  axios.get.mockResolvedValue(res);
  api.getQuotationAPI('url').then(response => {
    expect(response).toEqual(res);
    expect(axios.get.mock.calls[0][0]).toBe('url');
  });
});

test('extractQuotation', () => {
  const quotation = api.extractQuotation({
    data: {
      value: [
        { cotacaoVenda: 5.6008 }
      ]
    }
  });
  expect(quotation).toBe(5.6008);
});

describe('getToday', () => {
  const RealDate = Date;

  function mockDate(date) {
    global.Date = class extends RealDate {
      constructor() {
        return new RealDate(date);
      } 
    }
  }

  afterEach(() => {
    global.Date = RealDate;
  });

  test('getToday', () => {
    mockDate('2019-01-01T12:00:00z');
    const today = api.getToday();
    expect(today).toBe('1-1-2019');
  });
});

test('getURL', () => {
  const url = api.getURL('MINHA-DATA');
  expect(url).toBe("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='MINHA-DATA'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao");
});

test('getQuotation', () => {
  const res = {
    data: {
      value: [
        { cotacaoVenda: 5.6008 }
      ]
    }
  }

  // criando versões falsas de cada função
  const getToday = jest.fn();
  getToday.mockReturnValue("01-01-2019");

  const getURL = jest.fn();
  getURL.mockReturnValue("url");

  const getQuotationAPI = jest.fn();
  getQuotationAPI.mockResolvedValue(res); // usado para casos de funções assíncronas que precisam ser testadas

  const extractQuotation = jest.fn();
  extractQuotation.mockReturnValue(5.6008);

  api.pure
    .getQuotation({ getToday, getURL, getQuotationAPI, extractQuotation })()
    .then(quotation => {
      expect(quotation).toBe(5.6008);
    });
});

test('getQuotation', () => {
  const res = { }

  // criando versões falsas de cada função
  const getToday = jest.fn();
  getToday.mockReturnValue("01-01-2019");

  const getURL = jest.fn();
  getURL.mockReturnValue("url");

  const getQuotationAPI = jest.fn();
  getQuotationAPI.mockReturnValue(Promise.reject("err")); // código vai para o catch nesse ponto

  const extractQuotation = jest.fn(); // essa parte não é executada
  extractQuotation.mockReturnValue(5.6008);

  api.pure
    .getQuotation({ getToday, getURL, getQuotationAPI, extractQuotation })()
    .then(quotation => {
      expect(quotation).toBe("");
    });
});