const axios = require('axios');

const knowledge = ['我喜欢吃水果', '我不喜欢吃蔬菜', '对于肉类，有时候我喜欢吃，有时候不喜欢吃，比如膻味很重的羊肉我就不爱吃'];

const getEmbeddings = async (str) => await axios.post('https://openai.api2d.net/v1/embeddings', {
  model: 'text-embedding-ada-002',
  input: str
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fk....' // 替换成你的 Forward key
  }
});

const insertIntoVectorDB = async (text, uuid, embedding) => await axios.post('https://openai.api2d.net/vector', {
  text,
  uuid,
  embedding
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fk....' // 替换成你的 Forward key
  }
});

const getUUID = async () => await axios.get('https://openai.api2d.net/vector/uuid', {
  headers: {
    'Content-Type': 'application/json'
  }
});

const insertData = async () => {
  const uuid = (await getUUID()).data.uuid;

  console.log('uuid: ', uuid);

  for (let text of knowledge) {
    let embeddingResponse = await getEmbeddings(text);
    console.log('输入文本：', text, '，embeddings 请求结果：', embeddingResponse.data);

    let insertResponse = await insertIntoVectorDB(text, uuid, embeddingResponse.data.data[0].embedding);

    console.log('写入数据库请求结果：', insertResponse.data);
  }
}

insertData();
