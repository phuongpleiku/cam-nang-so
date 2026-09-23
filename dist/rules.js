export function matches(condition, answers) {
  if (!condition) return true;
  const value = answers[condition.question];
  return condition.values.some(v => Array.isArray(value) ? value.includes(v) : value === v);
}
export function visibleQuestions(procedure, answers) {
  return procedure.questions.filter(q => matches(q.when, answers));
}
export function noticesFor(procedure, answers) {
  return procedure.notices.filter(n => matches(n.when, answers));
}
export function hasAnswer(value) {
  return Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.length > 0;
}
export function isComplete(procedure, answers) {
  return !noticesFor(procedure, answers).some(n => n.blocking) && visibleQuestions(procedure, answers).every(q => hasAnswer(answers[q.id]));
}
export function setAnswer(procedure, answers, questionId, value) {
  const question = visibleQuestions(procedure, answers).find(q => q.id === questionId);
  if (!question) throw new Error('Câu hỏi không hợp lệ.');
  const values = question.type === 'multiple' ? value : [value];
  if (!Array.isArray(values) || new Set(values).size !== values.length || values.some(v => !question.options.some(o => o.value === v))) throw new Error('Câu trả lời không hợp lệ.');
  if (question.type !== 'multiple' && typeof value !== 'string') throw new Error('Chỉ chọn một câu trả lời.');
  if (values.length > 1 && values.some(v => question.options.find(o => o.value === v)?.exclusive)) throw new Error('Lựa chọn này không kết hợp với mục khác.');
  const next = {...answers, [questionId]: value};
  for (const q of procedure.questions) if (!matches(q.when, next)) delete next[q.id];
  return next;
}
export function checklistFor(procedure, answers) {
  return procedure.checklist.filter(i => matches(i.when, answers));
}
export function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}
export function searchProcedures(procedures, term, category = '') {
  const words = normalize(term).trim().split(/\s+/);
  return procedures.filter(p => (!category || p.category === category) && words.every(w => normalize([p.title,p.description,...p.keywords].join(' ')).includes(w)));
}
