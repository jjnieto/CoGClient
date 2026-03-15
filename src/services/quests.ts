import { apiClient } from './client';
import type { QuestInfo, PlayQuestRequest, PlayQuestResponse } from '../types/quest';

export function listQuests(token: string): Promise<QuestInfo[]> {
  return apiClient<QuestInfo[]>('/quests', { token });
}

export function playQuest(token: string, data: PlayQuestRequest): Promise<PlayQuestResponse> {
  return apiClient<PlayQuestResponse>('/quests/play', {
    method: 'POST',
    token,
    body: data,
  });
}
