// 🧪 TEST DEMO - Perplexity API + Flow complet
const PERPLEXITY_API_KEY = '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';

async function testActualitesMarketing() {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [
        {
          role: 'system',
          content: 'Tu es rédacteur spécialisé en actualités marketing digital. Retourne les sources et URLs.'
        },
        {
          role: 'user', 
          content: 'Quelles sont les 3 actualités les plus importantes aujourd\'hui en marketing digital ? Donne titres, résumés et sources URLs pour chaque.'
        }
      ],
      max_tokens: 800,
      temperature: 0.3
    })
  });
  
  const data = await response.json();
  console.log('🎯 Résultat Perplexity:', data.choices[0].message.content);
  return data.choices[0].message.content;
}

// Test rapide
console.log('🚀 Test Perplexity - Actualités Marketing...');
testActualitesMarketing();