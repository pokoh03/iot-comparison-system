const {ChartJSNodeCanvas} = require('chartjs-node-canvas')

const renderChart = async () => {
    const width = 800
    const height = 400
    const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height})

    const configuration = {
        type: 'bar',
        data: {
            labels: ['Traditional IoT', 'Blockchain-IoTA'],
            datasets: [
                {
                    label: 'TPS Comparison',
                    data: [1428.57, 1.25],
                    backgroundColor: ['#4bc0c0', '#9966ff'],
                },
            ],
        },
    }

    const image = await chartJSNodeCanvas.renderToBuffer(configuration)
    require('fs').writeFileSync('chart.png', image)
}

renderChart()
