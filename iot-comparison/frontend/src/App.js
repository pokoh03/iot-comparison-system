import React, {useState, useEffect} from 'react'

import {Bar} from 'react-chartjs-2'

function App() {
    const [results, setResults] = useState(null)

    useEffect(() => {
        fetch('http://localhost:3001/results')
            .then((res) => res.json())

            .then((data) => setResults(data))
    }, [])

    const data = {
        labels: ['Traditional IoT', 'Blockchain IoTA', 'Native IoTA'],

        datasets: [
            {
                label: 'Average Latency (ms)',

                data: results
                    ? [
                          results.traditional.latency,
                          results.blockchain.latency,
                          results.native.latency,
                      ]
                    : [0, 0, 0],

                backgroundColor: 'rgba(255, 99, 132, 0.2)',

                borderColor: 'rgba(255, 99, 132, 1)',

                borderWidth: 1,
            },

            {
                label: 'Throughput (TPS)',

                data: results
                    ? [
                          results.traditional.throughput,
                          results.blockchain.throughput,
                          results.native.throughput,
                      ]
                    : [0, 0, 0],

                backgroundColor: 'rgba(54, 162, 235, 0.2)',

                borderColor: 'rgba(54, 162, 235, 1)',

                borderWidth: 1,
            },
        ],
    }

    return (
        <div>
            <h1>IoT Architecture Performance Comparison</h1>

            {results ? (
                <Bar data={data} options={{scales: {y: {beginAtZero: true}}}} />
            ) : (
                <p>Loading results...</p>
            )}
        </div>
    )
}

export default App
