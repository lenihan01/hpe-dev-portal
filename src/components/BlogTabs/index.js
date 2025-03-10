import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Tab,
  Tabs,
  Menu,
  Text,
  Grommet,
  Box,
  ResponsiveContext,
} from 'grommet';
import { FormDown } from 'grommet-icons';
import { hpe } from 'grommet-theme-hpe';
import { deepMerge } from 'grommet/utils';
import { BlogTabContent } from '..';
import { useLocalStorage } from '../../hooks/use-local-storage';

const customTheme = deepMerge(hpe, {
  tab: {
    pad: {
      vertical: '0',
      horizontal: '0',
    },
  },
});

function BlogTabs({ data, columns }) {
  const [index, setIndex] = useState(0);
  const [platform, setPlatform] = useState(false);
  const [previousTab, setPreviousTab] = useState(0);
  const [platformContent, setPlatformContent] = useState({
    data: data.allBlogs,
  });
  const onActive = (nextIndex) => setIndex(nextIndex);
  const size = useContext(ResponsiveContext);

  const [activeBlogTab, setActiveBlogTab] = useLocalStorage('activeBlogTab');
  const [platformData, setPlatformData] = useLocalStorage('platformData');
  const [activePlatform, setActivePlatform] = useLocalStorage('activePlatform');

  const totalAllBlogsCount = data.allBlogsCount.totalCount;
  const totalOpenSourceBlogsCount = data.openSourceBlogsCount.totalCount;
  const totalOthersBlogsCount = data.othersBlogsCount.totalCount;

  useEffect(() => {
    // loads persisted platform data when the user goes back to the blog page
    if (platformData && platformData.nodes) {
      setPlatformContent({ data: platformData });
    }

    // loads persisted blog tab index # when user goes back to the blog page
    if (activeBlogTab) {
      setIndex(activeBlogTab);
      setPlatform(true);
    }
  }, [platformData, activeBlogTab]);

  const platforms = {
    ezmeralBlogs: {
      label: 'HPE Ezmeral',
      count: data.ezmeralBlogsCount.totalCount,
    },
    spiffeBlogs: {
      label: 'Spiffee and Spire Projects',
      count: data.spiffeBlogsCount.totalCount,
    },
    dataFabricBlogs: {
      label: 'HPE Ezmeral Data Fabric',
      count: data.dataFabricBlogsCount.totalCount,
    },
    greenlakeBlogs: {
      label: 'HPE GreenLake',
      count: data.greenlakeBlogsCount.totalCount,
    },
    chapelBlogs: {
      label: 'Chapel',
      count: data.chapelBlogsCount.totalCount,
    },
    grommetBlogs: {
      label: 'Grommet',
      count: data.grommetBlogsCount.totalCount,
    },
    alletraBlogs: {
      label: 'HPE Alletra',
      count: data.alletraBlogsCount.totalCount,
    },
    deepLearningBlogs: {
      label: 'HPE Deep Learning Cookbook',
      count: data.deepLearningBlogsCount.totalCount,
    },
    threeParBlogs: {
      label: 'HPE 3PAR and Primera',
      count: data.threeParBlogsCount.totalCount,
    },
    nimbleBlogs: {
      label: 'HPE Nimble Storage',
      count: data.nimbleBlogsCount.totalCount,
    },
    oneviewBlogs: {
      label: 'HPE OneView',
      count: data.oneviewBlogsCount.totalCount,
    },
    oneviewDashboardBlogs: {
      label: 'HPE OneView Global Dashboard',
      count: data.oneviewDashboardBlogsCount.totalCount,
    },
    determinedBlogs: {
      label: 'Determined AI',
      count: data.determinedBlogsCount.totalCount,
    },
    iloBlogs: {
      label: 'iLO RESTful API',
      count: data.iloBlogsCount.totalCount,
    },
    dsccBlogs: {
      label: 'Data Service Cloud Console',
      count: data.dsccBlogsCount.totalCount,
    },
  };

  const platformsMenuItems = Object.entries(data)
    .filter((item) => Object.prototype.hasOwnProperty.call(platforms, item[0]))
    .map((item, i) => {
      return {
        label: `${platforms[item[0]].label} (${platforms[item[0]].count})`,
        active: platforms[item[0]].label === activePlatform,
        onClick: () => {
          setActiveBlogTab(index);
          setPlatformData(item[1]);
          setPlatformContent({ key: i, data: item[1] });
          setActivePlatform(platforms[item[0]].label);
        },
      };
    });

  const previousTabContent = (previousTabIndex) => {
    const { allBlogs, openSourceBlogs, othersBlogs } = data;
    switch (previousTabIndex) {
      case 0:
        return allBlogs;
      case 2:
        return openSourceBlogs;
      case 3:
        return othersBlogs;
      default:
        return allBlogs;
    }
  };

  /* eslint-disable no-param-reassign */
  const totalAllPlatformsBlogsCount = Object.entries(platforms).reduce(
    (accum, item) => {
      accum += item[1].count;
      return accum;
    },
    0,
  );
  /* eslint-disable no-param-reassign */

  return (
    <Tabs activeIndex={index} onActive={onActive} justify="start" pad="20px">
      <Tab title={`All (${totalAllBlogsCount})`}>
        <BlogTabContent
          key={index}
          initialPage={data.allBlogs}
          columns={columns}
          activeTab={index}
          setPlatform={setPlatform}
          setPreviousTab={setPreviousTab}
        />
      </Tab>
      <Grommet theme={customTheme}>
        <Tab
          pad="none"
          title={
            <Menu
              /* eslint-disable-next-line no-unneeded-ternary */
              open={activePlatform ? true : false}
              dropProps={{
                align: { top: 'bottom', left: 'left' },
              }}
              items={platformsMenuItems}
            >
              <Box
                width="160px"
                height={size === 'small' ? '36px' : '48px'}
                justify="center"
                align="center"
                direction="row"
              >
                <Text color="black" margin={{ right: 'xsmall' }}>
                  Platforms ({totalAllPlatformsBlogsCount})
                </Text>
                <FormDown />
              </Box>
            </Menu>
          }
        >
          <BlogTabContent
            key={platformContent.key}
            initialPage={
              platform ? platformContent.data : previousTabContent(previousTab)
            }
            columns={columns}
            activeTab={index}
            platform
            setPlatform={setPlatform}
            setPreviousTab={setPreviousTab}
          />
        </Tab>
      </Grommet>
      <Tab title={`Open Source (${totalOpenSourceBlogsCount})`}>
        <BlogTabContent
          key={index}
          initialPage={data.openSourceBlogs}
          columns={columns}
          activeTab={index}
          setPlatform={setPlatform}
          setPreviousTab={setPreviousTab}
        />
      </Tab>
      <Tab title={`Others (${totalOthersBlogsCount})`}>
        <BlogTabContent
          key={index}
          initialPage={data.othersBlogs}
          columns={columns}
          activeTab={index}
          setPlatform={setPlatform}
          setPreviousTab={setPreviousTab}
        />
      </Tab>
    </Tabs>
  );
}

const blogsPropType = PropTypes.shape({
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      node: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        date: PropTypes.string,
        description: PropTypes.string,
        authorimage: PropTypes.string,
      }),
    }).isRequired,
  ).isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  nextPage: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  collection: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}).isRequired;

BlogTabs.propTypes = {
  data: PropTypes.shape({
    featuredblogs: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string.isRequired,
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
              author: PropTypes.string.isRequired,
              date: PropTypes.string,
              description: PropTypes.string,
              authorimage: PropTypes.string,
              thumbnailimage: PropTypes.string,
              category: PropTypes.string,
            }).isRequired,
            excerpt: PropTypes.string.isRequired,
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              sourceInstanceName: PropTypes.string.isRequired,
            }),
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
    allBlogs: blogsPropType,
    openSourceBlogs: blogsPropType,
    othersBlogs: blogsPropType,
    allBlogsCount: PropTypes.objectOf(PropTypes.number),
    openSourceBlogsCount: PropTypes.objectOf(PropTypes.number),
    ezmeralBlogsCount: PropTypes.objectOf(PropTypes.number),
    spiffeBlogsCount: PropTypes.objectOf(PropTypes.number),
    dataFabricBlogsCount: PropTypes.objectOf(PropTypes.number),
    greenlakeBlogsCount: PropTypes.objectOf(PropTypes.number),
    chapelBlogsCount: PropTypes.objectOf(PropTypes.number),
    grommetBlogsCount: PropTypes.objectOf(PropTypes.number),
    alletraBlogsCount: PropTypes.objectOf(PropTypes.number),
    deepLearningBlogsCount: PropTypes.objectOf(PropTypes.number),
    threeParBlogsCount: PropTypes.objectOf(PropTypes.number),
    nimbleBlogsCount: PropTypes.objectOf(PropTypes.number),
    oneviewBlogsCount: PropTypes.objectOf(PropTypes.number),
    oneviewDashboardBlogsCount: PropTypes.objectOf(PropTypes.number),
    iloBlogsCount: PropTypes.objectOf(PropTypes.number),
    determinedBlogsCount: PropTypes.objectOf(PropTypes.number),
    dsccBlogsCount: PropTypes.objectOf(PropTypes.number),
    othersBlogsCount: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
  columns: PropTypes.shape({
    small: PropTypes.string,
    medium: PropTypes.arrayOf(PropTypes.string),
    large: PropTypes.arrayOf(PropTypes.string),
    xlarge: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default BlogTabs;
