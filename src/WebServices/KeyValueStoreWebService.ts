export const KeyValueStoreWebService = {
  service: 'KVS.asmx/',

  //qryKVS(int _dataset, int _language)
  qryKVS: 'qryKVS',
  getKVS: 'getKVS',

  //setKVS()
  setKVS: 'setKVS',
  delKVS: 'delKVS',

  //qryLanguages()
  qryLanguages: 'qryLanguages',

  //getTranslator(string _email)
  getTranslator: 'getTranslator',

  //qryDatasets(int _dataset)
  qryDatasets: 'qryDatasets',
  getDataset: 'getDataset',

  //setDataset()
  setDataset: 'setDataset',
  delDataset: 'delDataset',


  qryAttachment: 'qryAttachment',
  setAttachment: 'setAttachment',
  delAttachment: 'delAttachment',
};
