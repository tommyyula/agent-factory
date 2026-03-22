# Agent Factory Platform - OBR 领域分析文档

## 1. OBR 本体建模理论基础

### 1.1 OBR 建模范式概述

**OBR (Object-Behavior-Rule)** 是一种面向业务的本体建模方法，相比传统的概念-关系模型，OBR 提供了更丰富的语义表达能力和更贴近业务实际的建模抽象。

**核心优势：**
- **业务导向**: 直接映射业务实体、操作和规则
- **动态建模**: 支持状态变更和行为序列建模
- **规则驱动**: 内置业务规则验证和执行机制
- **场景完整**: 端到端的业务流程场景建模

### 1.2 OBR 三元组理论

```
Domain Knowledge = Objects × Behaviors × Rules
                   ↓
Business Scenarios = Orchestrated(Objects, Behaviors, Rules)
                   ↓
AI Agents = Scenario-Scoped(Objects, Behaviors, Rules)
```

**理论基础：**
1. **对象抽象理论**: 基于 DDD (Domain-Driven Design) 的业务实体建模
2. **行为封装理论**: 基于 CQRS (Command Query Responsibility Segregation) 的操作分离
3. **规则引擎理论**: 基于产生式规则系统 (Production Rule Systems) 的业务逻辑表达
4. **工作流理论**: 基于 BPMN/Petri Net 的流程编排理论

### 1.3 与传统建模方法对比

| 维度 | 传统概念-关系模型 | OBR 本体模型 | 优势 |
|------|-----------------|-------------|-----|
| **实体建模** | 静态概念 + 属性 | 动态对象 + 状态机 | 支持状态变更和生命周期管理 |
| **操作建模** | 隐式关系推导 | 显式行为定义 | 明确的操作语义和执行逻辑 |
| **规则表达** | 约束集合 | 可执行规则引擎 | 实时验证和自动执行 |
| **流程建模** | 缺乏流程语义 | 完整场景编排 | 端到端业务流程支持 |
| **可执行性** | 知识表示 | 可执行模型 | 直接生成 AI Agent |

### 1.4 OBR 形式化语义

```
Object = (ID, Attributes, States, StateMachine, Constraints)
  where:
    Attributes: Name → (Type, Constraints)
    States: StateName → StateDefinition
    StateMachine: (States, Transitions, InitialState)
    Constraints: PredicateLogic

Behavior = (ID, Preconditions, Inputs, Outputs, StateChanges, Rules, Effects)
  where:
    Preconditions: ObjectState ∧ RuleChecks ∧ CustomConditions
    StateChanges: ObjectID → NewState
    Rules: RuleID × ExecutionPhase × Required

Rule = (ID, Condition, Actions, Scope, Priority)
  where:
    Condition: LogicalExpression
    Actions: ActionType × Target × Parameters
    Scope: Objects ∪ Behaviors ∪ Scenarios

Scenario = (ID, Actors, Steps, Triggers, Constraints)
  where:
    Steps: StepType × (Task ∪ Decision ∪ Parallel)
    Triggers: Manual ∪ Event ∪ Schedule ∪ Condition
```

## 2. Palantir Foundry 模式借鉴

### 2.1 Foundry 本体架构参考

Palantir Foundry 的本体建模提供了企业级数据建模的最佳实践：

**核心模式：**
1. **Object Types**: 业务实体的完整定义
2. **Link Types**: 实体间的语义关系
3. **Actions**: 对象操作的封装
4. **Worksheets**: 业务分析的工作台

**借鉴到 OBR 模型：**
- **Objects** ≈ Foundry Object Types + 状态机扩展
- **Links** ≈ Foundry Link Types + 12种语义关系扩展
- **Behaviors** ≈ Foundry Actions + 前置/后置条件
- **Scenarios** ≈ Foundry Workshops + BPMN 流程编排

### 2.2 企业级本体设计模式

```typescript
// Foundry-inspired 设计模式在 OBR 中的实现

// 1. 继承层次结构
interface ObjectHierarchy {
  baseObject: 'Entity';
  derivedObjects: {
    'Person': ['Employee', 'Customer', 'Supervisor'];
    'Resource': ['Asset', 'Equipment', 'Vehicle'];
    'Process': ['Shift', 'Schedule', 'Workflow'];
    'Event': ['Attendance', 'Transaction', 'Incident'];
  };
}

// 2. 标准化属性模式
interface StandardizedAttributes {
  identification: ['id', 'name', 'code'];
  temporal: ['createdAt', 'updatedAt', 'validFrom', 'validTo'];
  ownership: ['owner', 'creator', 'assignee'];
  categorization: ['type', 'category', 'status'];
  location: ['location', 'coordinate', 'address'];
}

// 3. 关系模式库
interface RelationshipPatterns {
  'owns': { multiplicity: '1:N', transitivity: false };
  'manages': { multiplicity: '1:N', transitivity: true };
  'reports_to': { multiplicity: 'N:1', antisymmetric: true };
  'depends_on': { multiplicity: 'N:N', acyclic: true };
  'triggers': { multiplicity: '1:N', temporal: true };
}
```

### 2.3 大规模本体治理策略

**版本控制策略：**
- 语义版本管理 (Major.Minor.Patch)
- 向后兼容性保证
- 数据迁移路径规划

**命名空间管理：**
- 领域分离 (HRM, WMS, TMS, etc.)
- 版本隔离 (v1, v2, v3)
- 环境分离 (dev, staging, prod)

**质量保证机制：**
- 自动化一致性检查
- 业务规则覆盖率分析
- 性能基准测试

## 3. HRM 领域深度分析

### 3.1 HRM 业务域边界

**核心业务流程：**
1. **人员管理**: 招聘、入职、调岗、离职
2. **时间管理**: 排班、考勤、休假、加班
3. **绩效管理**: 目标设定、评估、反馈、改进
4. **薪酬管理**: 工资计算、福利发放、激励分配
5. **培训发展**: 技能评估、培训计划、能力提升
6. **合规管理**: 劳动法遵循、安全规范、审计要求

**利益相关者分析：**
- **员工**: 工时记录、技能发展、职业规划
- **主管**: 团队管理、绩效评估、资源调配
- **HR 专员**: 政策执行、流程优化、数据分析
- **高层管理**: 人力成本、组织效率、战略决策
- **外部机构**: 劳动监察、社保机构、培训供应商

### 3.2 HRM 对象模型详细分析

#### 3.2.1 Employee（员工）对象

```typescript
const EMPLOYEE_OBJECT: OBRObject = {
  id: 'employee',
  name: 'Employee',
  displayName: '员工',
  description: '组织中的员工实体，管理完整的员工生命周期',
  category: 'entity',
  
  attributes: {
    // 基础身份信息
    employeeId: {
      type: 'string',
      required: true,
      constraints: { pattern: '^EMP[0-9]{6}$' },
      description: '员工工号，格式：EMP + 6位数字'
    },
    personalInfo: {
      type: 'object',
      required: true,
      properties: {
        firstName: { type: 'string', required: true },
        lastName: { type: 'string', required: true },
        dateOfBirth: { type: 'date', required: true },
        gender: { type: 'enum', enum: ['M', 'F', 'O'], required: false },
        nationality: { type: 'string', required: true },
        idNumber: { type: 'string', required: true }
      }
    },
    
    // 联系信息
    contactInfo: {
      type: 'object',
      required: true,
      properties: {
        email: {
          type: 'string',
          required: true,
          constraints: { pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }
        },
        phone: { type: 'string', required: true },
        address: { type: 'string', required: false },
        emergencyContact: {
          type: 'object',
          required: true,
          properties: {
            name: { type: 'string', required: true },
            relationship: { type: 'string', required: true },
            phone: { type: 'string', required: true }
          }
        }
      }
    },
    
    // 职业信息
    employmentInfo: {
      type: 'object',
      required: true,
      properties: {
        startDate: { type: 'date', required: true },
        endDate: { type: 'date', required: false },
        employmentType: {
          type: 'enum',
          enum: ['fulltime', 'parttime', 'contract', 'intern'],
          required: true
        },
        probationEndDate: { type: 'date', required: false }
      }
    },
    
    // 组织归属
    organizationInfo: {
      type: 'object',
      required: true,
      properties: {
        department: {
          type: 'reference',
          references: 'organization',
          required: true
        },
        position: { type: 'string', required: true },
        level: { type: 'string', required: true },
        supervisor: {
          type: 'reference',
          references: 'supervisor',
          required: false
        }
      }
    },
    
    // 技能和资质
    competencies: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          skillId: {
            type: 'reference',
            references: 'skill',
            required: true
          },
          level: {
            type: 'enum',
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            required: true
          },
          certified: { type: 'boolean', required: true },
          certificationDate: { type: 'date', required: false },
          expirationDate: { type: 'date', required: false }
        }
      }
    },
    
    // 工作偏好
    preferences: {
      type: 'object',
      required: false,
      properties: {
        preferredShifts: {
          type: 'array',
          items: { type: 'string' }
        },
        maxOvertimeHours: { type: 'number', default: 20 },
        availableDays: {
          type: 'array',
          items: {
            type: 'enum',
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          }
        }
      }
    }
  },
  
  // 员工状态机
  stateMachine: {
    initialState: 'probation',
    states: {
      'probation': {
        displayName: '试用期',
        description: '新员工试用期阶段'
      },
      'active': {
        displayName: '在职',
        description: '正常工作状态'
      },
      'on_leave': {
        displayName: '请假',
        description: '临时离开工作岗位'
      },
      'suspended': {
        displayName: '停职',
        description: '暂时停止工作'
      },
      'notice_period': {
        displayName: '离职流程',
        description: '正在办理离职手续'
      },
      'terminated': {
        displayName: '已离职',
        description: '雇佣关系结束',
        isTerminal: true
      }
    },
    transitions: [
      { from: 'probation', to: 'active', trigger: 'confirmProbation' },
      { from: 'probation', to: 'terminated', trigger: 'terminateProbation' },
      { from: 'active', to: 'on_leave', trigger: 'requestLeave' },
      { from: 'on_leave', to: 'active', trigger: 'returnFromLeave' },
      { from: 'active', to: 'suspended', trigger: 'suspend' },
      { from: 'suspended', to: 'active', trigger: 'reinstate' },
      { from: 'active', to: 'notice_period', trigger: 'initiateResignation' },
      { from: 'notice_period', to: 'terminated', trigger: 'completeResignation' },
      { from: 'suspended', to: 'terminated', trigger: 'terminateEmployee' }
    ]
  },
  
  // 业务约束
  constraints: [
    {
      id: 'valid_employment_period',
      type: 'invariant',
      expression: 'employmentInfo.endDate == null || employmentInfo.endDate > employmentInfo.startDate',
      description: '离职日期必须晚于入职日期',
      severity: 'error'
    },
    {
      id: 'probation_period_limit',
      type: 'invariant',
      expression: 'probationEndDate == null || probationEndDate <= addMonths(startDate, 6)',
      description: '试用期不得超过6个月',
      severity: 'error'
    },
    {
      id: 'emergency_contact_required',
      type: 'invariant',
      expression: 'contactInfo.emergencyContact != null',
      description: '必须提供紧急联系人信息',
      severity: 'error'
    },
    {
      id: 'skill_certification_validity',
      type: 'invariant',
      expression: 'all(competencies, c => !c.certified || c.expirationDate == null || c.expirationDate > now())',
      description: '已认证的技能证书不得过期',
      severity: 'warning'
    }
  ],
  
  visual: {
    color: '#3b82f6',
    icon: 'user',
    size: 'large'
  }
};
```

#### 3.2.2 Shift（班次）对象

```typescript
const SHIFT_OBJECT: OBRObject = {
  id: 'shift',
  name: 'Shift',
  displayName: '班次',
  description: '工作班次定义，包含时间、人员和技能要求',
  category: 'value_object',
  
  attributes: {
    shiftId: {
      type: 'string',
      required: true,
      constraints: { pattern: '^SH[0-9]{8}$' },
      description: '班次ID，格式：SH + 8位数字'
    },
    
    timeInfo: {
      type: 'object',
      required: true,
      properties: {
        startTime: { type: 'date', required: true },
        endTime: { type: 'date', required: true },
        duration: { type: 'number', computed: true }, // 计算属性
        timezone: { type: 'string', default: 'UTC+8' }
      }
    },
    
    shiftDetails: {
      type: 'object',
      required: true,
      properties: {
        shiftType: {
          type: 'enum',
          enum: ['morning', 'afternoon', 'night', 'overtime', 'emergency'],
          required: true
        },
        department: {
          type: 'reference',
          references: 'organization',
          required: true
        },
        location: { type: 'string', required: true },
        description: { type: 'string', required: false }
      }
    },
    
    requirements: {
      type: 'object',
      required: true,
      properties: {
        minEmployees: { type: 'number', required: true, min: 1 },
        maxEmployees: { type: 'number', required: true, min: 1 },
        requiredSkills: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              skillId: {
                type: 'reference',
                references: 'skill',
                required: true
              },
              minimumLevel: {
                type: 'enum',
                enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                required: true
              },
              required: { type: 'boolean', default: true }
            }
          }
        },
        preferredExperience: { type: 'number', min: 0 }
      }
    },
    
    assignment: {
      type: 'object',
      required: false,
      properties: {
        assignedEmployees: {
          type: 'array',
          items: {
            type: 'reference',
            references: 'employee'
          }
        },
        assignmentDate: { type: 'date' },
        assignedBy: {
          type: 'reference',
          references: 'employee'
        }
      }
    }
  },
  
  stateMachine: {
    initialState: 'draft',
    states: {
      'draft': { displayName: '草稿', description: '班次创建中' },
      'scheduled': { displayName: '已排班', description: '等待员工分配' },
      'assigned': { displayName: '已分配', description: '员工已分配完成' },
      'in_progress': { displayName: '进行中', description: '班次正在执行' },
      'completed': { displayName: '已完成', description: '班次执行完毕' },
      'cancelled': { displayName: '已取消', description: '班次被取消', isTerminal: true }
    },
    transitions: [
      { from: 'draft', to: 'scheduled', trigger: 'publishShift' },
      { from: 'scheduled', to: 'assigned', trigger: 'assignEmployees' },
      { from: 'assigned', to: 'in_progress', trigger: 'startShift' },
      { from: 'in_progress', to: 'completed', trigger: 'completeShift' },
      { from: 'draft', to: 'cancelled', trigger: 'cancelShift' },
      { from: 'scheduled', to: 'cancelled', trigger: 'cancelShift' },
      { from: 'assigned', to: 'cancelled', trigger: 'cancelShift' }
    ]
  },
  
  constraints: [
    {
      id: 'valid_time_range',
      type: 'invariant',
      expression: 'timeInfo.endTime > timeInfo.startTime',
      description: '班次结束时间必须晚于开始时间',
      severity: 'error'
    },
    {
      id: 'reasonable_duration',
      type: 'invariant',
      expression: 'duration >= 4 && duration <= 12',
      description: '班次时长应在4-12小时之间',
      severity: 'warning'
    },
    {
      id: 'valid_employee_count',
      type: 'invariant',
      expression: 'requirements.maxEmployees >= requirements.minEmployees',
      description: '最大员工数不得少于最小员工数',
      severity: 'error'
    },
    {
      id: 'future_start_time',
      type: 'precondition',
      expression: 'timeInfo.startTime > now()',
      description: '班次开始时间必须在未来',
      severity: 'error'
    }
  ],
  
  visual: {
    color: '#22c55e',
    icon: 'calendar',
    size: 'medium'
  }
};
```

### 3.3 HRM 行为模型详细分析

#### 3.3.1 createShift（创建班次）行为

```typescript
const CREATE_SHIFT_BEHAVIOR: OBRBehavior = {
  id: 'createShift',
  name: 'createShift',
  displayName: '创建班次',
  description: '创建新的工作班次，包括时间验证和资源检查',
  category: 'command',
  
  preconditions: {
    objectStates: [
      { objectId: 'organization', requiredState: 'active' }
    ],
    ruleChecks: [
      'no_time_conflict',
      'resource_availability',
      'department_capacity'
    ],
    customConditions: [
      'hasPermission(actor, "schedule_management")',
      'isBusinessDay(startTime) || hasApproval(overtime)',
      'department.isOperational(timeRange)'
    ]
  },
  
  inputs: {
    shiftData: {
      type: 'object',
      required: true,
      properties: {
        startTime: { type: 'date', required: true },
        endTime: { type: 'date', required: true },
        shiftType: {
          type: 'enum',
          required: true,
          values: ['morning', 'afternoon', 'night', 'overtime']
        },
        department: { type: 'string', required: true },
        location: { type: 'string', required: true },
        requiredSkills: {
          type: 'array',
          items: { type: 'string' },
          required: false
        },
        minEmployees: { type: 'number', required: true, min: 1 },
        maxEmployees: { type: 'number', required: true, min: 1 }
      },
      description: '班次基础信息'
    },
    creatorId: {
      type: 'string',
      required: true,
      validation: 'exists(employee, creatorId)',
      description: '创建者员工ID'
    },
    businessJustification: {
      type: 'string',
      required: false,
      description: '业务需求说明'
    }
  },
  
  outputs: {
    shiftId: {
      type: 'string',
      description: '创建的班次ID'
    },
    success: {
      type: 'boolean',
      description: '创建是否成功'
    },
    validationResults: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ruleId: { type: 'string' },
          passed: { type: 'boolean' },
          message: { type: 'string' },
          severity: { type: 'string' }
        }
      },
      description: '规则验证结果'
    },
    conflicts: {
      type: 'array',
      items: { type: 'string' },
      description: '检测到的冲突列表'
    },
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          suggestion: { type: 'string' },
          impact: { type: 'string' }
        }
      },
      description: '系统建议'
    }
  },
  
  stateChanges: [
    {
      objectId: 'shift',
      newState: 'draft',
      condition: 'success == true'
    },
    {
      objectId: 'department',
      newState: 'scheduling_in_progress',
      condition: 'isFirstShiftOfPeriod(department, timeRange)'
    }
  ],
  
  linkedRules: [
    { ruleId: 'min_rest_8h', phase: 'before', required: true },
    { ruleId: 'max_consecutive_12h', phase: 'during', required: true },
    { ruleId: 'overtime_approval', phase: 'before', required: false },
    { ruleId: 'skill_match_80', phase: 'during', required: true }
  ],
  
  sideEffects: [
    {
      type: 'notify',
      target: 'supervisor',
      data: {
        event: 'shift_created',
        shiftId: '${outputs.shiftId}',
        priority: 'normal'
      }
    },
    {
      type: 'update',
      target: 'department_schedule',
      data: {
        operation: 'add_shift',
        shiftId: '${outputs.shiftId}',
        timeRange: '${inputs.shiftData.startTime}-${inputs.shiftData.endTime}'
      }
    },
    {
      type: 'create',
      target: 'audit_log',
      data: {
        action: 'create_shift',
        actor: '${inputs.creatorId}',
        timestamp: 'now()',
        details: '${inputs.shiftData}'
      }
    }
  ],
  
  errorHandling: {
    timeoutMs: 30000,
    retryPolicy: {
      maxRetries: 3,
      backoffMs: 1000
    },
    rollbackActions: [
      'removeCreatedShift',
      'revertDepartmentState',
      'cancelNotifications'
    ]
  },
  
  visual: {
    color: '#22c55e',
    icon: 'calendar-plus',
    position: { x: 300, y: 150 }
  }
};
```

#### 3.3.2 assignEmployee（分配员工）行为

```typescript
const ASSIGN_EMPLOYEE_BEHAVIOR: OBRBehavior = {
  id: 'assignEmployee',
  name: 'assignEmployee',
  displayName: '分配员工',
  description: '将员工分配到特定班次，包含技能匹配和可用性验证',
  category: 'command',
  
  preconditions: {
    objectStates: [
      { objectId: 'shift', requiredState: 'scheduled' },
      { objectId: 'employee', requiredState: 'active' }
    ],
    ruleChecks: [
      'employee_availability',
      'skill_match_80',
      'max_consecutive_12h',
      'min_rest_8h'
    ],
    customConditions: [
      'hasPermission(actor, "employee_assignment")',
      'employee.department == shift.department || hasApproval(crossDepartment)',
      '!hasConflictingShift(employee, shift.timeRange)'
    ]
  },
  
  inputs: {
    shiftId: {
      type: 'string',
      required: true,
      validation: 'exists(shift, shiftId) && shift.status == "scheduled"',
      description: '目标班次ID'
    },
    employeeId: {
      type: 'string',
      required: true,
      validation: 'exists(employee, employeeId) && employee.status == "active"',
      description: '员工ID'
    },
    assignment: {
      type: 'object',
      required: true,
      properties: {
        role: {
          type: 'enum',
          values: ['worker', 'lead', 'supervisor', 'specialist'],
          required: true
        },
        priority: {
          type: 'enum',
          values: ['mandatory', 'preferred', 'optional'],
          required: true
        },
        notes: { type: 'string', required: false }
      },
      description: '分配详情'
    },
    assignerId: {
      type: 'string',
      required: true,
      validation: 'exists(employee, assignerId)',
      description: '分配人员ID'
    },
    overrideConflicts: {
      type: 'boolean',
      default: false,
      description: '是否覆盖冲突检查'
    }
  },
  
  outputs: {
    assignmentId: {
      type: 'string',
      description: '分配记录ID'
    },
    success: {
      type: 'boolean',
      description: '分配是否成功'
    },
    skillMatchScore: {
      type: 'number',
      min: 0,
      max: 100,
      description: '技能匹配分数'
    },
    conflicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          severity: { type: 'string' },
          description: { type: 'string' },
          resolution: { type: 'string' }
        }
      },
      description: '检测到的冲突及解决方案'
    },
    alternatives: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          employeeId: { type: 'string' },
          matchScore: { type: 'number' },
          availability: { type: 'string' },
          reason: { type: 'string' }
        }
      },
      description: '替代员工建议'
    }
  },
  
  stateChanges: [
    {
      objectId: 'shift',
      newState: 'assigned',
      condition: 'shift.assignedEmployees.length >= shift.minEmployees'
    },
    {
      objectId: 'employee',
      newState: 'scheduled',
      condition: 'success == true'
    }
  ],
  
  linkedRules: [
    { ruleId: 'skill_match_80', phase: 'before', required: true },
    { ruleId: 'min_rest_8h', phase: 'before', required: true },
    { ruleId: 'max_consecutive_12h', phase: 'before', required: true },
    { ruleId: 'overtime_approval', phase: 'before', required: false }
  ],
  
  sideEffects: [
    {
      type: 'notify',
      target: 'employee',
      data: {
        event: 'shift_assigned',
        shiftId: '${inputs.shiftId}',
        shiftDetails: '${shift.timeInfo}',
        priority: 'high'
      }
    },
    {
      type: 'update',
      target: 'employee_schedule',
      data: {
        operation: 'add_assignment',
        employeeId: '${inputs.employeeId}',
        shiftId: '${inputs.shiftId}',
        timeRange: '${shift.timeInfo}'
      }
    },
    {
      type: 'create',
      target: 'assignment_record',
      data: {
        assignmentId: '${outputs.assignmentId}',
        shiftId: '${inputs.shiftId}',
        employeeId: '${inputs.employeeId}',
        assignerId: '${inputs.assignerId}',
        assignment: '${inputs.assignment}',
        skillMatchScore: '${outputs.skillMatchScore}',
        timestamp: 'now()'
      }
    }
  ],
  
  compensationActions: [
    {
      trigger: 'assignment_failed',
      actions: [
        'revertShiftState',
        'notifyAssigner',
        'suggestAlternatives'
      ]
    },
    {
      trigger: 'skill_mismatch',
      actions: [
        'createTrainingRecommendation',
        'escalateToSupervisor'
      ]
    }
  ],
  
  visual: {
    color: '#f97316',
    icon: 'user-plus',
    position: { x: 450, y: 200 }
  }
};
```

### 3.4 HRM 规则模型详细分析

#### 3.4.1 最少休息8小时规则

```typescript
const MIN_REST_8H_RULE: OBRRule = {
  id: 'min_rest_8h',
  name: 'minimumRest8Hours',
  displayName: '最少休息8小时',
  description: '员工连续班次之间必须有至少8小时的休息时间',
  category: 'invariant',
  priority: 9, // 高优先级，接近法律要求
  
  condition: {
    expression: `
      forall(employee: Employee, shift1: Shift, shift2: Shift,
        (isAssigned(employee, shift1) && isAssigned(employee, shift2) && 
         shift2.startTime > shift1.endTime) =>
        (shift2.startTime - shift1.endTime) >= duration(8, hours)
      )
    `,
    naturalLanguage: '当员工被分配到两个连续班次时，第二个班次的开始时间与第一个班次的结束时间之间必须至少相隔8小时',
    variables: {
      'employee': 'Employee',
      'shift1': 'Shift',
      'shift2': 'Shift',
      'shift1.endTime': 'DateTime',
      'shift2.startTime': 'DateTime'
    }
  },
  
  actions: [
    {
      type: 'block',
      message: '违反最少休息时间规定：员工 {employee.name} 在班次 {shift1.id} 结束后需要至少8小时休息时间，不能立即参与班次 {shift2.id}',
      severity: 'error',
      data: {
        requiredRestTime: 8,
        actualRestTime: 'calculateRestTime(shift1.endTime, shift2.startTime)',
        legalBasis: '劳动法第38条'
      }
    },
    {
      type: 'notify',
      target: 'supervisor',
      message: '检测到休息时间不足的班次分配尝试',
      severity: 'warning',
      data: {
        employeeId: '${employee.id}',
        conflictingShifts: ['${shift1.id}', '${shift2.id}'],
        suggestedAction: '重新安排班次时间或分配其他员工'
      }
    }
  ],
  
  scope: {
    objects: ['employee', 'shift', 'schedule'],
    behaviors: ['createShift', 'assignEmployee', 'modifyShift'],
    scenarios: ['normal_scheduling', 'emergency_substitution', 'overtime_assignment']
  },
  
  conflicts: [
    {
      ruleId: 'emergency_override',
      resolution: 'override',
      description: '紧急情况下可以临时覆盖休息时间限制，但需要特殊审批和后续补偿'
    }
  ],
  
  exceptions: [
    {
      condition: 'isEmergencyShift(shift2) && hasManagerApproval(assignment)',
      action: 'warn',
      compensations: [
        'grantCompensatoryTime',
        'requireMedicalCheck',
        'limitConsecutiveEmergencyShifts'
      ]
    },
    {
      condition: 'employee.contractType == "emergency_responder"',
      action: 'warn',
      modifications: {
        minRestTime: 6 // 紧急响应人员可以减少到6小时
      }
    }
  ],
  
  testCases: [
    {
      id: 'test_valid_rest',
      description: '正常8小时休息间隔',
      input: {
        shift1: { endTime: '2024-03-22T22:00:00Z' },
        shift2: { startTime: '2024-03-23T08:00:00Z' },
        employee: { id: 'EMP123456', contractType: 'regular' }
      },
      expectedResult: 'pass',
      actualResult: null
    },
    {
      id: 'test_insufficient_rest',
      description: '休息时间不足8小时',
      input: {
        shift1: { endTime: '2024-03-22T22:00:00Z' },
        shift2: { startTime: '2024-03-23T04:00:00Z' },
        employee: { id: 'EMP123456', contractType: 'regular' }
      },
      expectedResult: 'fail',
      actualResult: null
    },
    {
      id: 'test_emergency_exception',
      description: '紧急情况例外',
      input: {
        shift1: { endTime: '2024-03-22T22:00:00Z' },
        shift2: { startTime: '2024-03-23T04:00:00Z', type: 'emergency' },
        employee: { id: 'EMP123456', contractType: 'regular' },
        approval: { managerId: 'MGR001', approved: true }
      },
      expectedResult: 'warn',
      actualResult: null
    }
  ],
  
  metrics: {
    violationCount: 0,
    exceptionCount: 0,
    averageRestTime: 0,
    complianceRate: 100
  },
  
  auditTrail: {
    createdBy: 'HR_SYSTEM',
    createdAt: '2024-01-01T00:00:00Z',
    lastUpdated: '2024-03-22T00:00:00Z',
    approvedBy: 'LEGAL_TEAM',
    legalReferences: [
      '劳动法第38条',
      '劳动部关于职工工作时间的规定'
    ]
  }
};
```

#### 3.4.2 技能匹配度80%规则

```typescript
const SKILL_MATCH_80_RULE: OBRRule = {
  id: 'skill_match_80',
  name: 'skillMatch80Percent',
  displayName: '技能匹配度80%',
  description: '员工技能与岗位要求的匹配度必须达到80%以上',
  category: 'validation',
  priority: 7,
  
  condition: {
    expression: `
      forall(employee: Employee, shift: Shift,
        isAssigned(employee, shift) =>
        calculateSkillMatch(employee.competencies, shift.requirements.requiredSkills) >= 80
      )
    `,
    naturalLanguage: '当员工被分配到班次时，其技能水平必须与班次要求匹配度达到80%或以上',
    variables: {
      'employee.competencies': 'Array<Competency>',
      'shift.requirements.requiredSkills': 'Array<SkillRequirement>',
      'skillMatchScore': 'Number'
    }
  },
  
  actions: [
    {
      type: 'validate',
      severity: 'error',
      message: '员工 {employee.name} 的技能匹配度为 {skillMatchScore}%，不满足班次 {shift.id} 的80%要求',
      data: {
        requiredThreshold: 80,
        actualScore: '${skillMatchScore}',
        missingSkills: 'findMissingSkills(employee.competencies, shift.requirements)',
        trainingRecommendations: 'generateTrainingPlan(missingSkills)'
      }
    },
    {
      type: 'warn',
      severity: 'warning',
      condition: 'skillMatchScore >= 70 && skillMatchScore < 80',
      message: '员工技能匹配度偏低，建议提供额外培训或指导',
      data: {
        supportActions: ['assignMentor', 'provideTraining', 'increaseSupervision']
      }
    }
  ],
  
  calculationMethod: {
    algorithm: 'weighted_skill_matching',
    implementation: `
      function calculateSkillMatch(employeeSkills, requiredSkills) {
        let totalWeight = 0;
        let matchedWeight = 0;
        
        for (const requirement of requiredSkills) {
          const weight = requirement.required ? 1.0 : 0.5;
          totalWeight += weight;
          
          const employeeSkill = findSkill(employeeSkills, requirement.skillId);
          if (employeeSkill) {
            const levelMatch = calculateLevelMatch(
              employeeSkill.level, 
              requirement.minimumLevel
            );
            matchedWeight += weight * levelMatch;
          }
        }
        
        return totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
      }
      
      function calculateLevelMatch(employeeLevel, requiredLevel) {
        const levelValues = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
        const empValue = levelValues[employeeLevel] || 0;
        const reqValue = levelValues[requiredLevel] || 1;
        return empValue >= reqValue ? 1.0 : empValue / reqValue;
      }
    `
  },
  
  scope: {
    objects: ['employee', 'shift', 'skill'],
    behaviors: ['assignEmployee', 'createShift', 'validateAssignment'],
    scenarios: ['normal_scheduling', 'emergency_substitution']
  },
  
  adaptiveThresholds: {
    emergencyShift: {
      threshold: 60,
      justification: '紧急情况下降低技能要求，但需要额外监督'
    },
    trainingShift: {
      threshold: 50,
      justification: '培训班次允许技能不足的员工参与学习',
      requirements: ['assignMentor', 'reducedResponsibility']
    },
    criticalOperation: {
      threshold: 95,
      justification: '关键操作需要极高的技能匹配度'
    }
  },
  
  compensationActions: [
    {
      trigger: 'skill_gap_identified',
      actions: [
        'createTrainingPlan',
        'scheduleMentoring',
        'adjustShiftComplexity'
      ]
    },
    {
      trigger: 'no_qualified_employee',
      actions: [
        'escalateToManager',
        'searchExternalResources',
        'delayShiftIfPossible'
      ]
    }
  ],
  
  testCases: [
    {
      id: 'test_perfect_match',
      description: '完美技能匹配',
      input: {
        employee: {
          competencies: [
            { skillId: 'forklift_operation', level: 'advanced' },
            { skillId: 'inventory_management', level: 'expert' }
          ]
        },
        shift: {
          requirements: {
            requiredSkills: [
              { skillId: 'forklift_operation', minimumLevel: 'intermediate', required: true },
              { skillId: 'inventory_management', minimumLevel: 'advanced', required: true }
            ]
          }
        }
      },
      expectedResult: 'pass',
      expectedScore: 100
    },
    {
      id: 'test_partial_match',
      description: '部分技能匹配',
      input: {
        employee: {
          competencies: [
            { skillId: 'forklift_operation', level: 'beginner' }
          ]
        },
        shift: {
          requirements: {
            requiredSkills: [
              { skillId: 'forklift_operation', minimumLevel: 'intermediate', required: true },
              { skillId: 'inventory_management', minimumLevel: 'beginner', required: true }
            ]
          }
        }
      },
      expectedResult: 'fail',
      expectedScore: 25
    }
  ]
};
```

### 3.5 HRM 场景模型详细分析

#### 3.5.1 正常排班流程场景

```typescript
const NORMAL_SCHEDULING_SCENARIO: OBRScenario = {
  id: 'normal_scheduling',
  name: 'normalScheduling',
  displayName: '正常排班流程',
  description: '标准的员工排班业务流程，包含需求分析、技能匹配、班次创建、员工分配等完整环节',
  category: 'process',
  
  actors: [
    {
      id: 'scheduler',
      name: '排班员',
      role: 'operator',
      permissions: [
        'schedule_read',
        'schedule_write',
        'employee_query',
        'shift_create',
        'assignment_suggest'
      ]
    },
    {
      id: 'supervisor',
      name: '部门主管',
      role: 'approver',
      permissions: [
        'schedule_approve',
        'overtime_approve',
        'conflict_resolve',
        'resource_allocate'
      ]
    },
    {
      id: 'hr_specialist',
      name: 'HR专员',
      role: 'advisor',
      permissions: [
        'policy_interpret',
        'compliance_check',
        'employee_profile_access'
      ]
    }
  ],
  
  steps: [
    {
      id: 'start_scheduling',
      name: '开始排班',
      type: 'start',
      next: 'analyze_demand',
      visual: { position: { x: 100, y: 100 }, type: 'bpmn' }
    },
    
    {
      id: 'analyze_demand',
      name: '分析业务需求',
      type: 'task',
      task: {
        behaviorId: 'analyzeDemand',
        actorId: 'scheduler',
        inputs: {
          period: 'next_week',
          departments: ['warehouse', 'transport', 'customer_service'],
          constraints: {
            budgetLimit: 50000,
            headcountLimit: 100,
            mandatoryOperations: ['morning_shift', 'evening_shift']
          }
        },
        outputs: {
          demandAnalysis: 'DemandAnalysisResult',
          prioritizedRequirements: 'Array<RequirementPriority>',
          resourceGaps: 'Array<ResourceGap>'
        },
        timeout: 1800000 // 30分钟
      },
      next: 'validate_resources',
      visual: { position: { x: 200, y: 100 }, type: 'bpmn' }
    },
    
    {
      id: 'validate_resources',
      name: '验证资源可用性',
      type: 'task',
      task: {
        behaviorId: 'validateResources',
        actorId: 'scheduler',
        inputs: {
          demandAnalysis: '${analyze_demand.demandAnalysis}',
          availableEmployees: 'getAllAvailableEmployees(period)',
          skillInventory: 'getSkillInventory(departments)'
        },
        outputs: {
          resourceValidation: 'ResourceValidationResult',
          availabilityMatrix: 'EmployeeAvailabilityMatrix',
          skillGaps: 'Array<SkillGap>'
        }
      },
      next: 'skill_matching_decision',
      visual: { position: { x: 300, y: 100 }, type: 'bpmn' }
    },
    
    {
      id: 'skill_matching_decision',
      name: '技能匹配决策',
      type: 'decision',
      decision: {
        condition: 'resourceValidation.overallMatchRate >= 80',
        branches: [
          {
            condition: 'resourceValidation.overallMatchRate >= 80',
            nextStepId: 'create_shifts'
          },
          {
            condition: 'resourceValidation.overallMatchRate < 80 && resourceValidation.overallMatchRate >= 60',
            nextStepId: 'seek_supervisor_approval'
          },
          {
            condition: 'resourceValidation.overallMatchRate < 60',
            nextStepId: 'escalate_resource_shortage'
          }
        ]
      },
      visual: { position: { x: 400, y: 100 }, type: 'bpmn' }
    },
    
    {
      id: 'seek_supervisor_approval',
      name: '寻求主管批准',
      type: 'task',
      task: {
        behaviorId: 'seekApproval',
        actorId: 'supervisor',
        inputs: {
          approvalRequest: {
            type: 'skill_shortage',
            details: '${validate_resources.skillGaps}',
            proposedSolutions: [
              'external_contractor',
              'overtime_assignment',
              'cross_training',
              'service_level_reduction'
            ]
          }
        },
        outputs: {
          approvalResult: 'ApprovalResult',
          chosenSolution: 'string',
          additionalConstraints: 'Array<Constraint>'
        }
      },
      next: 'create_shifts',
      visual: { position: { x: 500, y: 150 }, type: 'bpmn' }
    },
    
    {
      id: 'escalate_resource_shortage',
      name: '上报资源短缺',
      type: 'task',
      task: {
        behaviorId: 'escalateShortage',
        actorId: 'hr_specialist',
        inputs: {
          shortageReport: {
            severity: 'high',
            affectedDepartments: '${analyze_demand.departments}',
            skillGaps: '${validate_resources.skillGaps}',
            businessImpact: 'calculateBusinessImpact(skillGaps)',
            urgency: 'immediate'
          }
        },
        outputs: {
          escalationResult: 'EscalationResult',
          actionPlan: 'EmergencyActionPlan',
          timeline: 'ActionTimeline'
        }
      },
      next: 'emergency_scheduling',
      visual: { position: { x: 500, y: 50 }, type: 'bpmn' }
    },
    
    {
      id: 'create_shifts',
      name: '创建班次',
      type: 'parallel',
      parallel: {
        branches: [
          ['create_morning_shifts', 'assign_morning_employees'],
          ['create_afternoon_shifts', 'assign_afternoon_employees'],
          ['create_night_shifts', 'assign_night_employees']
        ],
        syncType: 'all'
      },
      next: 'validate_assignments',
      visual: { position: { x: 600, y: 100 }, type: 'bpmn' }
    },
    
    {
      id: 'create_morning_shifts',
      name: '创建早班班次',
      type: 'task',
      task: {
        behaviorId: 'createShift',
        actorId: 'scheduler',
        inputs: {
          shiftData: {
            shiftType: 'morning',
            startTime: 'period.start + 08:00',
            endTime: 'period.start + 16:00',
            departments: '${analyze_demand.departments}',
            requiredSkills: 'extractSkillRequirements(demandAnalysis, "morning")'
          }
        }
      },
      next: 'assign_morning_employees',
      visual: { position: { x: 700, y: 80 }, type: 'bpmn' }
    },
    
    {
      id: 'assign_morning_employees',
      name: '分配早班员工',
      type: 'task',
      task: {
        behaviorId: 'batchAssignEmployees',
        actorId: 'scheduler',
        inputs: {
          shifts: '${create_morning_shifts.createdShifts}',
          availableEmployees: 'filterByPreference(availableEmployees, "morning")',
          optimization: {
            criteria: ['skill_match', 'cost_efficiency', 'employee_preference'],
            weights: [0.5, 0.3, 0.2]
          }
        }
      },
      next: 'validate_assignments',
      visual: { position: { x: 800, y: 80 }, type: 'bpmn' }
    },
    
    {
      id: 'validate_assignments',
      name: '验证分配结果',
      type: 'task',
      task: {
        behaviorId: 'validateAssignments',
        actorId: 'scheduler',
        inputs: {
          assignments: 'aggregateAssignments([morning, afternoon, night])',
          validationRules: [
            'min_rest_8h',
            'max_consecutive_12h',
            'skill_match_80',
            'overtime_approval'
          ]
        },
        outputs: {
          validationResult: 'AssignmentValidationResult',
          violations: 'Array<RuleViolation>',
          overallScore: 'number'
        }
      },
      next: 'final_approval_decision',
      visual: { position: { x: 900, y: 100 }, type: 'bpmn' }
    },
    
    {
      id: 'final_approval_decision',
      name: '最终审批决策',
      type: 'decision',
      decision: {
        condition: 'validationResult.overallScore >= 85 && violations.length == 0',
        branches: [
          {
            condition: 'validationResult.overallScore >= 85 && violations.length == 0',
            nextStepId: 'publish_schedule'
          },
          {
            condition: 'violations.length > 0',
            nextStepId: 'resolve_violations'
          }
        ]
      },
      visual: { position: { x: 1000, y: 100 }, type: 'bpmn' }
    },
    
    {
      id: 'resolve_violations',
      name: '解决规则违反',
      type: 'task',
      task: {
        behaviorId: 'resolveViolations',
        actorId: 'scheduler',
        inputs: {
          violations: '${validate_assignments.violations}',
          resolutionStrategies: [
            'reassign_employee',
            'modify_shift_time',
            'split_shift',
            'request_exception'
          ]
        }
      },
      next: 'validate_assignments',
      visual: { position: { x: 1000, y: 200 }, type: 'bpmn' }
    },
    
    {
      id: 'publish_schedule',
      name: '发布排班表',
      type: 'task',
      task: {
        behaviorId: 'publishSchedule',
        actorId: 'supervisor',
        inputs: {
          schedule: 'finalizeSchedule(assignments)',
          notificationChannels: ['email', 'mobile_app', 'bulletin_board'],
          effectiveDate: 'period.start'
        },
        outputs: {
          publishResult: 'PublishResult',
          employeeNotifications: 'Array<NotificationRecord>',
          scheduleId: 'string'
        }
      },
      next: 'end_scheduling',
      visual: { position: { x: 1100, y: 100 }, type: 'bpmn' }
    },
    
    {
      id: 'emergency_scheduling',
      name: '紧急排班处理',
      type: 'task',
      task: {
        behaviorId: 'emergencyScheduling',
        actorId: 'hr_specialist',
        inputs: {
          emergencyPlan: '${escalate_resource_shortage.actionPlan}',
          availableActions: [
            'contractor_hiring',
            'overtime_authorization',
            'service_reduction',
            'shift_consolidation'
          ]
        }
      },
      next: 'end_scheduling',
      visual: { position: { x: 1100, y: 50 }, type: 'bpmn' }
    },
    
    {
      id: 'end_scheduling',
      name: '排班完成',
      type: 'end',
      visual: { position: { x: 1200, y: 100 }, type: 'bpmn' }
    }
  ],
  
  triggers: [
    {
      type: 'schedule',
      schedule: '0 9 * * 1', // 每周一上午9点
      description: '定时触发周度排班'
    },
    {
      type: 'event',
      event: 'demand_change_detected',
      description: '检测到业务需求变化时触发'
    },
    {
      type: 'manual',
      description: '手动启动排班流程'
    }
  ],
  
  constraints: {
    timeLimit: 14400000, // 4小时完成
    resourceLimits: {
      maxConcurrentTasks: 10,
      maxMemoryUsage: '500MB'
    },
    businessRules: [
      'min_rest_8h',
      'max_consecutive_12h',
      'skill_match_80',
      'overtime_approval',
      'budget_limit',
      'headcount_limit'
    ]
  },
  
  errorHandling: {
    timeoutActions: ['escalate_to_management', 'activate_contingency_plan'],
    failureRecovery: ['rollback_assignments', 'notify_stakeholders'],
    dataValidation: ['check_employee_availability', 'verify_skill_data']
  },
  
  metrics: {
    averageDuration: 7200000, // 2小时
    successRate: 92.5,
    commonFailurePoints: [
      'skill_matching_decision',
      'validate_assignments'
    ],
    performanceKPIs: {
      scheduleCompleteness: 98.5,
      employeeSatisfaction: 4.2,
      costEfficiency: 87.3,
      complianceScore: 99.1
    }
  },
  
  integrationPoints: [
    {
      system: 'Payroll',
      trigger: 'schedule_published',
      data: 'employee_shift_assignments'
    },
    {
      system: 'TimeTracking',
      trigger: 'shifts_created',
      data: 'shift_definitions'
    },
    {
      system: 'LearningManagement',
      trigger: 'skill_gap_identified',
      data: 'training_recommendations'
    }
  ]
};
```

## 4. 关系映射和语义网络

### 4.1 12种语义关系详细定义

```typescript
// 语义关系类型定义和实际应用示例
const SEMANTIC_RELATIONSHIPS: Record<string, {
  definition: string;
  properties: RelationshipProperties;
  examples: Example[];
  constraints: string[];
}> = {
  
  'is_a': {
    definition: '继承/类型关系，表示子类与父类的关系',
    properties: {
      transitivity: true,
      symmetry: false,
      reflexivity: false,
      multiplicity: 'N:1'
    },
    examples: [
      { source: 'FullTimeEmployee', target: 'Employee', description: '全职员工是员工的一种' },
      { source: 'OvertimeShift', target: 'Shift', description: '加班班次是班次的一种' },
      { source: 'ManagerialSkill', target: 'Skill', description: '管理技能是技能的一种' }
    ],
    constraints: [
      'acyclic', // 不能形成循环继承
      'single_inheritance' // 每个子类只能有一个直接父类
    ]
  },
  
  'part_of': {
    definition: '组成关系，表示部分与整体的关系',
    properties: {
      transitivity: true,
      symmetry: false,
      reflexivity: false,
      multiplicity: 'N:1'
    },
    examples: [
      { source: 'Employee', target: 'Organization', description: '员工属于组织' },
      { source: 'Shift', target: 'Schedule', description: '班次属于排班表' },
      { source: 'Competency', target: 'Employee', description: '能力属于员工' }
    ],
    constraints: [
      'acyclic', // 避免部分包含整体
      'exclusive_ownership' // 部分只能属于一个整体
    ]
  },
  
  'depends_on': {
    definition: '依赖关系，表示一个实体的存在或操作依赖于另一个实体',
    properties: {
      transitivity: true,
      symmetry: false,
      reflexivity: false,
      multiplicity: 'N:N'
    },
    examples: [
      { source: 'assignEmployee', target: 'createShift', description: '分配员工操作依赖于创建班次' },
      { source: 'Attendance', target: 'Shift', description: '考勤记录依赖于班次存在' },
      { source: 'overtime_approval', target: 'min_rest_8h', description: '加班审批规则依赖于休息时间规则' }
    ],
    constraints: [
      'acyclic', // 避免循环依赖
      'dependency_strength' // 依赖强度必须明确
    ]
  },
  
  'triggers': {
    definition: '触发关系，表示一个事件或行为触发另一个事件或行为',
    properties: {
      transitivity: false,
      symmetry: false,
      reflexivity: false,
      multiplicity: '1:N'
    },
    examples: [
      { source: 'employeeResignation', target: 'rescheduling_scenario', description: '员工离职触发重排班场景' },
      { source: 'overtimeRequest', target: 'overtime_approval', description: '加班申请触发审批规则' },
      { source: 'shiftCompletion', target: 'updateAttendance', description: '班次完成触发考勤更新' }
    ],
    constraints: [
      'temporal_ordering', // 触发事件必须有时间先后顺序
      'causality_verification' // 必须验证因果关系
    ]
  },
  
  'precedes': {
    definition: '前置关系，表示时间或逻辑上的先后顺序',
    properties: {
      transitivity: true,
      symmetry: false,
      reflexivity: false,
      multiplicity: 'N:N'
    },
    examples: [
      { source: 'skillAssessment', target: 'employeeAssignment', description: '技能评估必须在员工分配之前' },
      { source: 'shiftCreation', target: 'employeeNotification', description: '班次创建在员工通知之前' },
      { source: 'morningShift', target: 'afternoonShift', description: '早班在下午班之前' }
    ],
    constraints: [
      'strict_ordering', // 严格的顺序关系
      'time_consistency' // 时间一致性检查
    ]
  },
  
  'conflicts_with': {
    definition: '冲突关系，表示两个实体或操作之间存在互斥或冲突',
    properties: {
      transitivity: false,
      symmetry: true,
      reflexivity: false,
      multiplicity: 'N:N'
    },
    examples: [
      { source: 'employeeLeave', target: 'shiftAssignment', description: '员工请假与班次分配冲突' },
      { source: 'overtimeShift', target: 'restRequirement', description: '加班班次与休息要求冲突' },
      { source: 'crossDepartmentAssignment', target: 'departmentPolicy', description: '跨部门分配与部门政策冲突' }
    ],
    constraints: [
      'mutual_exclusion', // 互斥关系
      'conflict_resolution_required' // 需要冲突解决机制
    ]
  },
  
  'implements': {
    definition: '实现关系，表示具体实现抽象定义或接口',
    properties: {
      transitivity: false,
      symmetry: false,
      reflexivity: false,
      multiplicity: 'N:1'
    },
    examples: [
      { source: 'punchInBehavior', target: 'attendanceInterface', description: '打卡行为实现考勤接口' },
      { source: 'skillMatchRule', target: 'validationPolicy', description: '技能匹配规则实现验证政策' },
      { source: 'normalSchedulingScenario', target: 'schedulingWorkflow', description: '正常排班场景实现排班工作流' }
    ],
    constraints: [
      'interface_compliance', // 接口合规性
      'implementation_completeness' // 实现完整性
    ]
  },
  
  'validates': {
    definition: '验证关系，表示一个规则或检查验证另一个实体',
    properties: {
      transitivity: false,
      symmetry: false,
      reflexivity: false,
      multiplicity: 'N:N'
    },
    examples: [
      { source: 'min_rest_8h', target: 'employeeAssignment', description: '8小时休息规则验证员工分配' },
      { source: 'skill_match_80', target: 'shiftAssignment', description: '技能匹配规则验证班次分配' },
      { source: 'overtimeApprovalRule', target: 'overtimeRequest', description: '加班审批规则验证加班申请' }
    ],
    constraints: [
      'validation_logic', // 验证逻辑必须明确
      'validation_timing' // 验证时机必须合适
    ]
  },
  
  'aggregates': {
    definition: '聚合关系，表示一个实体聚合多个相关实体',
    properties: {
      transitivity: false,
      symmetry: false,
      reflexivity: false,
      multiplicity: '1:N'
    },
    examples: [
      { source: 'Schedule', target: 'Shift', description: '排班表聚合多个班次' },
      { source: 'Employee', target: 'Competency', description: '员工聚合多个能力' },
      { source: 'Organization', target: 'Department', description: '组织聚合多个部门' }
    ],
    constraints: [
      'aggregation_rules', // 聚合规则
      'lifecycle_management' // 生命周期管理
    ]
  },
  
  'uses': {
    definition: '使用关系，表示一个实体使用另一个实体的服务或功能',
    properties: {
      transitivity: false,
      symmetry: false,
      reflexivity: false,
      multiplicity: 'N:N'
    },
    examples: [
      { source: 'assignEmployeeBehavior', target: 'skillMatchingService', description: '员工分配行为使用技能匹配服务' },
      { source: 'schedulingScenario', target: 'ruleEngine', description: '排班场景使用规则引擎' },
      { source: 'Employee', target: 'Skill', description: '员工使用技能完成工作' }
    ],
    constraints: [
      'usage_permissions', // 使用权限
      'service_availability' // 服务可用性
    ]
  },
  
  'produces': {
    definition: '产生关系，表示一个行为或过程产生某种结果',
    properties: {
      transitivity: false,
      symmetry: false,
      reflexivity: false,
      multiplicity: '1:N'
    },
    examples: [
      { source: 'createShiftBehavior', target: 'Shift', description: '创建班次行为产生班次实体' },
      { source: 'attendanceTracking', target: 'AttendanceRecord', description: '考勤跟踪产生考勤记录' },
      { source: 'skillAssessment', target: 'CompetencyReport', description: '技能评估产生能力报告' }
    ],
    constraints: [
      'output_validation', // 输出验证
      'production_consistency' // 生产一致性
    ]
  },
  
  'consumes': {
    definition: '消费关系，表示一个行为或过程消费某种资源',
    properties: {
      transitivity: false,
      symmetry: false,
      reflexivity: false,
      multiplicity: 'N:1'
    },
    examples: [
      { source: 'assignEmployeeBehavior', target: 'AvailableEmployee', description: '员工分配行为消费可用员工资源' },
      { source: 'overtimeShift', target: 'OvertimeBudget', description: '加班班次消费加班预算' },
      { source: 'trainingProgram', target: 'TrainingResource', description: '培训项目消费培训资源' }
    ],
    constraints: [
      'resource_availability', // 资源可用性
      'consumption_limits' // 消费限制
    ]
  }
};
```

### 4.2 HRM 领域语义网络图

```typescript
// HRM 领域完整的语义网络定义
const HRM_SEMANTIC_NETWORK: OBRLink[] = [
  
  // 对象间的继承关系 (is_a)
  {
    id: 'fulltime_is_employee',
    sourceId: 'fulltime_employee',
    targetId: 'employee',
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'is_a',
    description: '全职员工是员工的一种特殊类型',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#3b82f6', width: 3, label: 'is-a' }
  },
  
  {
    id: 'parttime_is_employee',
    sourceId: 'parttime_employee',
    targetId: 'employee',
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'is_a',
    description: '兼职员工是员工的一种特殊类型',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#3b82f6', width: 3, label: 'is-a' }
  },
  
  // 组成关系 (part_of)
  {
    id: 'employee_part_of_organization',
    sourceId: 'employee',
    targetId: 'organization',
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'part_of',
    description: '员工是组织的组成部分',
    properties: { weight: 0.9, direction: 'unidirectional', multiplicity: 'N:1' },
    visual: { style: 'dashed', color: '#22c55e', width: 2, label: 'part-of' }
  },
  
  {
    id: 'shift_part_of_schedule',
    sourceId: 'shift',
    targetId: 'schedule',
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'part_of',
    description: '班次是排班表的组成部分',
    properties: { weight: 1.0, direction: 'unidirectional', multiplicity: 'N:1' },
    visual: { style: 'dashed', color: '#22c55e', width: 2, label: 'part-of' }
  },
  
  // 依赖关系 (depends_on)
  {
    id: 'assign_depends_create',
    sourceId: 'assignEmployee',
    targetId: 'createShift',
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'depends_on',
    description: '员工分配行为依赖于班次创建行为',
    properties: { weight: 0.8, direction: 'unidirectional' },
    visual: { style: 'dotted', color: '#f97316', width: 2, label: 'depends-on' }
  },
  
  {
    id: 'attendance_depends_shift',
    sourceId: 'attendance',
    targetId: 'shift',
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'depends_on',
    description: '考勤记录依赖于班次的存在',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'dotted', color: '#f97316', width: 2, label: 'depends-on' }
  },
  
  // 触发关系 (triggers)
  {
    id: 'resignation_triggers_reschedule',
    sourceId: 'employee_resignation',
    targetId: 'resignation_triggered_rescheduling',
    sourceType: 'behavior',
    targetType: 'scenario',
    relationshipType: 'triggers',
    description: '员工离职触发重新排班场景',
    properties: { weight: 0.9, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#ef4444', width: 2, label: 'triggers' }
  },
  
  {
    id: 'overtime_request_triggers_approval',
    sourceId: 'request_overtime',
    targetId: 'overtime_approval',
    sourceType: 'behavior',
    targetType: 'rule',
    relationshipType: 'triggers',
    description: '加班申请触发加班审批规则',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#ef4444', width: 2, label: 'triggers' }
  },
  
  // 前置关系 (precedes)
  {
    id: 'create_precedes_assign',
    sourceId: 'createShift',
    targetId: 'assignEmployee',
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'precedes',
    description: '创建班次必须在分配员工之前执行',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#8b5cf6', width: 2, label: 'precedes' }
  },
  
  {
    id: 'punchin_precedes_punchout',
    sourceId: 'punchIn',
    targetId: 'punchOut',
    sourceType: 'behavior',
    targetType: 'behavior',
    relationshipType: 'precedes',
    description: '打卡上班必须在打卡下班之前',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#8b5cf6', width: 2, label: 'precedes' }
  },
  
  // 冲突关系 (conflicts_with)
  {
    id: 'leave_conflicts_assignment',
    sourceId: 'employee_leave',
    targetId: 'shift_assignment',
    sourceType: 'object',
    targetType: 'behavior',
    relationshipType: 'conflicts_with',
    description: '员工请假与班次分配存在冲突',
    properties: { weight: 0.9, direction: 'bidirectional' },
    visual: { style: 'dashed', color: '#dc2626', width: 2, label: 'conflicts' }
  },
  
  {
    id: 'overtime_conflicts_rest',
    sourceId: 'overtime_shift',
    targetId: 'min_rest_8h',
    sourceType: 'object',
    targetType: 'rule',
    relationshipType: 'conflicts_with',
    description: '加班班次可能与最少休息8小时规则冲突',
    properties: { weight: 0.7, direction: 'bidirectional' },
    visual: { style: 'dashed', color: '#dc2626', width: 2, label: 'conflicts' }
  },
  
  // 实现关系 (implements)
  {
    id: 'punchin_implements_attendance',
    sourceId: 'punchIn',
    targetId: 'attendance_interface',
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'implements',
    description: '打卡上班行为实现考勤接口',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#14b8a6', width: 2, label: 'implements' }
  },
  
  {
    id: 'normal_scheduling_implements_workflow',
    sourceId: 'normal_scheduling',
    targetId: 'scheduling_workflow',
    sourceType: 'scenario',
    targetType: 'object',
    relationshipType: 'implements',
    description: '正常排班场景实现排班工作流接口',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#14b8a6', width: 2, label: 'implements' }
  },
  
  // 验证关系 (validates)
  {
    id: 'min_rest_validates_assignment',
    sourceId: 'min_rest_8h',
    targetId: 'assignEmployee',
    sourceType: 'rule',
    targetType: 'behavior',
    relationshipType: 'validates',
    description: '最少休息8小时规则验证员工分配行为',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'dotted', color: '#a855f7', width: 2, label: 'validates' }
  },
  
  {
    id: 'skill_match_validates_assignment',
    sourceId: 'skill_match_80',
    targetId: 'assignEmployee',
    sourceType: 'rule',
    targetType: 'behavior',
    relationshipType: 'validates',
    description: '技能匹配80%规则验证员工分配',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'dotted', color: '#a855f7', width: 2, label: 'validates' }
  },
  
  // 聚合关系 (aggregates)
  {
    id: 'employee_aggregates_skills',
    sourceId: 'employee',
    targetId: 'skill',
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'aggregates',
    description: '员工聚合多种技能能力',
    properties: { weight: 0.8, direction: 'unidirectional', multiplicity: '1:N' },
    visual: { style: 'solid', color: '#06b6d4', width: 2, label: 'aggregates' }
  },
  
  {
    id: 'schedule_aggregates_shifts',
    sourceId: 'schedule',
    targetId: 'shift',
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'aggregates',
    description: '排班表聚合多个班次',
    properties: { weight: 1.0, direction: 'unidirectional', multiplicity: '1:N' },
    visual: { style: 'solid', color: '#06b6d4', width: 2, label: 'aggregates' }
  },
  
  // 使用关系 (uses)
  {
    id: 'assign_uses_skill_service',
    sourceId: 'assignEmployee',
    targetId: 'skill_matching_service',
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'uses',
    description: '员工分配行为使用技能匹配服务',
    properties: { weight: 0.8, direction: 'unidirectional' },
    visual: { style: 'dashed', color: '#84cc16', width: 2, label: 'uses' }
  },
  
  {
    id: 'scenario_uses_rule_engine',
    sourceId: 'normal_scheduling',
    targetId: 'rule_engine',
    sourceType: 'scenario',
    targetType: 'object',
    relationshipType: 'uses',
    description: '排班场景使用规则引擎进行验证',
    properties: { weight: 0.9, direction: 'unidirectional' },
    visual: { style: 'dashed', color: '#84cc16', width: 2, label: 'uses' }
  },
  
  // 产生关系 (produces)
  {
    id: 'create_shift_produces_shift',
    sourceId: 'createShift',
    targetId: 'shift',
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'produces',
    description: '创建班次行为产生班次实体',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#eab308', width: 2, label: 'produces' }
  },
  
  {
    id: 'attendance_tracking_produces_record',
    sourceId: 'trackAttendance',
    targetId: 'attendance',
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'produces',
    description: '考勤跟踪行为产生考勤记录',
    properties: { weight: 1.0, direction: 'unidirectional' },
    visual: { style: 'solid', color: '#eab308', width: 2, label: 'produces' }
  },
  
  // 消费关系 (consumes)
  {
    id: 'assign_consumes_availability',
    sourceId: 'assignEmployee',
    targetId: 'employee_availability',
    sourceType: 'behavior',
    targetType: 'object',
    relationshipType: 'consumes',
    description: '员工分配行为消费员工可用性资源',
    properties: { weight: 0.9, direction: 'unidirectional' },
    visual: { style: 'dotted', color: '#f59e0b', width: 2, label: 'consumes' }
  },
  
  {
    id: 'overtime_consumes_budget',
    sourceId: 'overtime_shift',
    targetId: 'overtime_budget',
    sourceType: 'object',
    targetType: 'object',
    relationshipType: 'consumes',
    description: '加班班次消费加班预算资源',
    properties: { weight: 0.8, direction: 'unidirectional' },
    visual: { style: 'dotted', color: '#f59e0b', width: 2, label: 'consumes' }
  }
];
```

### 4.3 语义推理和查询

```typescript
// 基于语义网络的推理引擎
class SemanticReasoningEngine {
  
  // 传递闭包推理
  findTransitiveClosure(
    sourceId: string, 
    relationshipType: string, 
    network: OBRLink[]
  ): string[] {
    const relationships = SEMANTIC_RELATIONSHIPS[relationshipType];
    if (!relationships.properties.transitivity) {
      return [];
    }
    
    const visited = new Set<string>();
    const results: string[] = [];
    
    const explore = (currentId: string) => {
      if (visited.has(currentId)) return;
      visited.add(currentId);
      
      const directLinks = network.filter(
        link => link.sourceId === currentId && link.relationshipType === relationshipType
      );
      
      for (const link of directLinks) {
        results.push(link.targetId);
        explore(link.targetId); // 递归探索
      }
    };
    
    explore(sourceId);
    return results;
  }
  
  // 冲突检测
  detectConflicts(
    proposedAction: any,
    network: OBRLink[]
  ): ConflictReport[] {
    const conflicts: ConflictReport[] = [];
    
    const conflictLinks = network.filter(
      link => link.relationshipType === 'conflicts_with'
    );
    
    for (const link of conflictLinks) {
      if (this.isActionAffected(proposedAction, link)) {
        conflicts.push({
          conflictType: 'direct_conflict',
          source: link.sourceId,
          target: link.targetId,
          severity: this.calculateConflictSeverity(link),
          resolution: this.suggestResolution(link)
        });
      }
    }
    
    return conflicts;
  }
  
  // 依赖链分析
  analyzeDependencyChain(
    targetAction: string,
    network: OBRLink[]
  ): DependencyChain {
    const dependencies = network.filter(
      link => link.targetId === targetAction && link.relationshipType === 'depends_on'
    );
    
    const chain: DependencyChain = {
      target: targetAction,
      directDependencies: dependencies.map(d => d.sourceId),
      transitiveDependencies: [],
      criticalPath: [],
      estimatedTime: 0
    };
    
    // 计算传递依赖
    for (const dep of dependencies) {
      const transitive = this.findTransitiveClosure(dep.sourceId, 'depends_on', network);
      chain.transitiveDependencies.push(...transitive);
    }
    
    // 计算关键路径
    chain.criticalPath = this.findCriticalPath(chain);
    
    return chain;
  }
  
  // 语义查询接口
  query(
    queryExpression: string,
    network: OBRLink[]
  ): QueryResult {
    // 支持类 SPARQL 的语义查询
    // 例如: "FIND objects WHERE skill_match_80 validates ?behavior AND ?behavior uses ?object"
    
    const parsed = this.parseQuery(queryExpression);
    const results = this.executeQuery(parsed, network);
    
    return {
      query: queryExpression,
      results,
      executionTime: performance.now(),
      resultCount: results.length
    };
  }
  
  private parseQuery(expression: string): ParsedQuery {
    // 查询解析逻辑
    return {
      selectClause: [],
      whereClause: [],
      variables: new Map(),
      constraints: []
    };
  }
  
  private executeQuery(parsed: ParsedQuery, network: OBRLink[]): any[] {
    // 查询执行逻辑
    return [];
  }
}

// 使用示例
const reasoningEngine = new SemanticReasoningEngine();

// 查找所有员工类型
const employeeTypes = reasoningEngine.findTransitiveClosure(
  'employee', 
  'is_a', 
  HRM_SEMANTIC_NETWORK
);

// 检测排班冲突
const conflicts = reasoningEngine.detectConflicts(
  { action: 'assignEmployee', employeeId: 'EMP123', shiftId: 'SH456' },
  HRM_SEMANTIC_NETWORK
);

// 分析依赖链
const dependencies = reasoningEngine.analyzeDependencyChain(
  'assignEmployee',
  HRM_SEMANTIC_NETWORK
);
```

---

*本领域分析文档深入分析了 OBR 建模理论基础、Palantir Foundry 模式借鉴、HRM 领域完整建模以及复杂的语义关系网络，为 Agent Factory Platform 的 OBR 升级提供了完整的理论指导和实践蓝图。*