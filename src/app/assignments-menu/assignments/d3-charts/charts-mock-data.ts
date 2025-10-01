import { TreeChartDataModel } from './charts-models';

export const treeChartMockData: TreeChartDataModel = {
  name: 'Main Group',
  model: 'org',
  children: [
    {
      name: 'First test group',
      groupCount: 6,
      assetCount: 13,
      model: 'group',
      isRoot: true,
      children: [
        {
          name: 'test assigned group creating',
          groupCount: 3,
          assetCount: 10,
          model: 'group',
          children: [
            {
              name: 'My Group',
              groupCount: 2,
              assetCount: 6,
              model: 'group',
            },
            {
              name: 'alerton',
              model: 'asset',
            },
            {
              name: 'fortiswitch',
              version: 'v6.0.1',
              model: 'asset',
            },
            {
              name: 'IDC-Tools-Upper-7-4',
              version: '2.145',
              model: 'asset',
            },
            {
              name: 'NIDS-Tools',
              version: '2.5',
              model: 'asset',
            },
            {
              name: 'SEL-351S-1',
              version: 'SEL-351S-6-R116-V0-Z007005-D20060727","0966"',
              model: 'asset',
            },
            {
              name: 'SEL2030-160',
              model: 'asset',
            },
          ],
        },
        {
          name: 'test new group',
          groupCount: 5,
          assetCount: 12,
          model: 'group',
          children: [
            {
              name: 'av_demo',
              version: '5.17.7',
              model: 'asset',
            },
            {
              name: 'fortiswitch',
              version: 'v6.0.1',
              model: 'asset',
            },
            {
              name: 'test assigned group creating',
              groupCount: 3,
              assetCount: 10,
              model: 'group',
              children: [
                {
                  name: 'My Group',
                  groupCount: 2,
                  assetCount: 6,
                  model: 'group',
                },
                {
                  name: 'alerton',
                  model: 'asset',
                },
                {
                  name: 'fortiswitch',
                  version: 'v6.0.1',
                  model: 'asset',
                },
                {
                  name: 'IDC-Tools-Upper-7-4',
                  version: '2.145',
                  model: 'asset',
                },
                {
                  name: 'NIDS-Tools',
                  version: '2.5',
                  model: 'asset',
                },
                {
                  name: 'SEL-351S-1',
                  version: 'SEL-351S-6-R116-V0-Z007005-D20060727","0966"',
                  model: 'asset',
                },
                {
                  name: 'SEL2030-160',
                  model: 'asset',
                },
              ],
            },
            {
              name: 'test create child group',
              groupCount: 0,
              assetCount: 1,
              model: 'group',
            },
          ],
        },
        {
          name: 'av_demo',
          version: '5.17.7',
          model: 'asset',
        },
        {
          name: 'IDC-Tools-Upper-7-4',
          version: '2.145',
          model: 'asset',
        },
        {
          name: 'SEL-3620-2',
          version: 'R208',
          model: 'asset',
        },
      ],
    },
    {
      name: 'Super',
      groupCount: 0,
      assetCount: 0,
      model: 'group',
      isRoot: true,
    },
    {
      name: 'test name on created group',
      groupCount: 0,
      assetCount: 1,
      model: 'group',
      isRoot: true,
      children: [
        {
          name: 'IDC-Tools-Upper-7-4',
          version: '2.145',
          model: 'asset',
        },
      ],
    },
  ],
};
