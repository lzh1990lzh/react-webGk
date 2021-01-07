const chartOpts: any = {
  title: {
    text: '',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      //type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  color: ['#FF5B82', '#25CDEC'],
  legend: {
    data: ['进门人次', '出门人次'],
  },
  grid: {
    top: '11%',
    left: '3%',
    right: '4%',
    bottom: '5%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
  ],
  yAxis: [
    {
      type: 'value',
      minInterval: 1,
    },
  ],
  series: [
    {
      name: '进门人次',
      type: 'bar',
      barWidth: 30, // 柱形的宽度
      barCategoryGap: '20%', // 柱形的间距
      data: [],
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: {
              //数值样式
              color: '#FF5B82',
              fontSize: 16,
            },
          },
          barBorderRadius: [18, 18, 0, 0],
        },
      },
    },
    {
      name: '出门人次',
      type: 'bar',
      barWidth: 30, // 柱形的宽度
      barCategoryGap: '20%', // 柱形的间距
      data: [],
      itemStyle: {
        normal: {
          label: {
            show: true, //开启显示
            position: 'top', //在上方显示
            textStyle: {
              //数值样式
              color: '#25CDEC',
              fontSize: 16,
            },
          },
          barBorderRadius: [18, 18, 0, 0],
        },
      },
    },
  ],
};

export default chartOpts;
