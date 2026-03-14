import { ontologyDB, agentDB, runtimeDB, userDB } from '../shared/services/database';
import { mockOntologies, wmsConcepts, wmsRelations } from './mockOntologies';
import { mockAgents } from './mockAgents';
import { mockDeployments, mockTasks, mockChannels, mockMessages } from './mockRuntimeData';
import { User } from '../shared/types/common.types';

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'admin',
    email: 'admin@item.com',
    displayName: 'System Administrator',
    avatar: undefined,
    roles: ['admin', 'user'],
    preferences: {
      theme: 'dark',
      language: 'zh',
      timezone: 'Asia/Shanghai',
      notifications: {
        email: true,
        push: true,
        channels: ['channel-001', 'channel-003']
      }
    },
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: 'user-002',
    username: 'developer',
    email: 'dev@item.com',
    displayName: 'Development Team',
    avatar: undefined,
    roles: ['developer', 'user'],
    preferences: {
      theme: 'dark',
      language: 'zh',
      timezone: 'Asia/Shanghai',
      notifications: {
        email: false,
        push: true,
        channels: ['channel-001', 'channel-002']
      }
    },
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(Date.now() - 60 * 60 * 1000)
  },
  {
    id: 'user-003',
    username: 'operator',
    email: 'ops@item.com',
    displayName: 'Operations Team',
    avatar: undefined,
    roles: ['operator', 'user'],
    preferences: {
      theme: 'light',
      language: 'zh',
      timezone: 'Asia/Shanghai',
      notifications: {
        email: true,
        push: false,
        channels: ['channel-003', 'channel-004']
      }
    },
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 30 * 60 * 1000)
  }
];

export async function seedDatabase(): Promise<boolean> {
  try {
    console.log('开始初始化数据库...');

    // 检查是否已经有数据 - 暂时强制重新种子以确保数据正确
    const existingOntologies = await ontologyDB.ontologies.count();
    const existingAgents = await agentDB.agents.count();

    // 暂时强制重新种子数据以确保所有数据正确加载
    console.log(`发现现有数据: ${existingOntologies} 个本体, ${existingAgents} 个代理`);
    console.log('强制重新种子数据以确保一致性...');

    // 清空所有表
    await Promise.all([
      ontologyDB.ontologies.clear(),
      ontologyDB.concepts.clear(),
      ontologyDB.relations.clear(),
      agentDB.agents.clear(),
      runtimeDB.deployments.clear(),
      runtimeDB.jobs.clear(),
      runtimeDB.messages.clear(),
      userDB.users.clear()
    ]);

    // 种子 Ontology 数据
    console.log('种子 Ontology 数据...');
    await ontologyDB.ontologies.bulkAdd(mockOntologies);
    await ontologyDB.concepts.bulkAdd(wmsConcepts);
    await ontologyDB.relations.bulkAdd(wmsRelations);

    // 种子 Agent 数据
    console.log('种子 Agent 数据...');
    await agentDB.agents.bulkAdd(mockAgents);

    // 种子 Runtime 数据
    console.log('种子 Runtime 数据...');
    await runtimeDB.deployments.bulkAdd(mockDeployments);
    await runtimeDB.jobs.bulkAdd(mockTasks);
    await runtimeDB.messages.bulkAdd(mockMessages);

    // 种子 User 数据
    console.log('种子 User 数据...');
    await userDB.users.bulkAdd(mockUsers);

    console.log('数据库初始化完成！');
    console.log(`- Ontologies: ${mockOntologies.length}`);
    console.log(`- Concepts: ${wmsConcepts.length}`);
    console.log(`- Relations: ${wmsRelations.length}`);
    console.log(`- Agents: ${mockAgents.length}`);
    console.log(`- Deployments: ${mockDeployments.length}`);
    console.log(`- Tasks: ${mockTasks.length}`);
    console.log(`- Messages: ${mockMessages.length}`);
    console.log(`- Users: ${mockUsers.length}`);

    return true;
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return false;
  }
}

// 清除所有数据
export async function clearAllData(): Promise<boolean> {
  try {
    await Promise.all([
      ontologyDB.ontologies.clear(),
      ontologyDB.concepts.clear(),
      ontologyDB.relations.clear(),
      agentDB.agents.clear(),
      runtimeDB.deployments.clear(),
      runtimeDB.jobs.clear(),
      runtimeDB.messages.clear(),
      userDB.users.clear()
    ]);
    console.log('所有数据已清除');
    return true;
  } catch (error) {
    console.error('清除数据失败:', error);
    return false;
  }
}

// 重新种子数据（清除 + 种子）
export async function reseedDatabase(): Promise<boolean> {
  console.log('重新种子数据库...');
  await clearAllData();
  return await seedDatabase();
}