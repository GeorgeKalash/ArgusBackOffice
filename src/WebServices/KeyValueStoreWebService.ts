export const KeyValueStoreWebService = {
  service: 'KVS.asmx/',

  //KVS(int _dataset, int _language)
  qryKVS: 'qryKVS',
  getKVS: 'getKVS',
  setKVS: 'setKVS',
  delKVS: 'delKVS',

  //Languages
  qryLanguages: 'qryLanguages',

  //Translator(string _email)
  getTranslator: 'getTranslator',

  //Datasets
  qryDatasets: 'qryDatasets',
  getDataset: 'getDataset',
  setDataset: 'setDataset',
  delDataset: 'delDataset',

  //Releases
  qryRelease: 'qryRelease',
  getRelease: 'getRelease',
  setRelease: 'setRelease',
  delRelease: 'delRelease',


  //ReleaseGuide
  qryReleaseGuide: 'qryReleaseGuide',
  getReleaseGuide: 'getReleaseGuide',
  setReleaseGuide: 'setReleaseGuide',
  delReleaseGuide: 'delReleaseGuide',

  qryAttachment: 'qryAttachment',
  setAttachment: 'setAttachment',
  delAttachment: 'delAttachment',
};
