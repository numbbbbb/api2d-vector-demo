const axios = require('axios');

const question = '你喜不喜欢吃肉';

const searchable_id = '186009-1225e1de-5d7b-4750-bfa5-c194463e5be8';

const getEmbeddings = async (str) => await axios.post('https://openai.api2d.net/v1/embeddings', {
  model: 'text-embedding-ada-002',
  input: str
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fk....' // 替换成你的 Forward key
  }
});

const queryVectorDB = async (embedding) => await axios.post('https://openai.api2d.net/vector/search', {
  embedding,
  searchable_id
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fk....' // 替换成你的 Forward key
  }
});

const editByGPT = async (text) => await axios.post('https://openai.api2d.net/v1/chat/completions', {
  model: 'gpt-3.5-turbo-0301',
  messages: [
    {
      "role": "system",
      "content": "你是一个问答机器人，我会给你用户的问题，以及这个问题对应的答案，请你帮忙润色，整理成一个可读性更高的回复。"
    },
    {
      "role": "user",
      "content": `问题是：${question}，对应的答案是：${text}`
    },
  ],
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer fk....' // 替换成你的 Forward key
  }
});

const askQuestion = async () => {
  let embeddingResponse = await getEmbeddings(question);
  console.log(embeddingResponse.data.data[0].embedding);
  let queryResponse = await queryVectorDB(embeddingResponse.data.data[0].embedding);

  console.log('搜索结果：', queryResponse.data.data.Get.Text);
  console.log('答案：', queryResponse.data.data.Get.Text[0].text);

  let gptResponse = await editByGPT(queryResponse.data.data.Get.Text[0].text);

  console.log('润色结果：', gptResponse.data.choices[0].message);
}

askQuestion();

