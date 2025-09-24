export const formatOverviewText = (text) => {
  if (!text) return '';

  return text
    .split('. ')
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0)
    .map(sentence => {
      const formattedSentence = sentence.endsWith('.') ? sentence : sentence + '.';
      return `- ${formattedSentence}`;
    })
    .join('\n');
};