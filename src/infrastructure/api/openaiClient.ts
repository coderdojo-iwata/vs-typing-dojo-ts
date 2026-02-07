interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature: number;
}

export async function callChatCompletion(
  apiKey: string,
  request: ChatCompletionRequest
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401) {
      throw new Error('APIキーが無効です。確認してください。');
    }
    if (status === 429) {
      throw new Error(
        'APIのレート制限に達しました。しばらく待ってからお試しください。'
      );
    }
    throw new Error(`出題文の取得に失敗しました。(${status})`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
