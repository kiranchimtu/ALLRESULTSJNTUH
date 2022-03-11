import React from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

interface mapProps {
  key: string
  value: number
}

export function RenderEachSubjectOverAllPassFailBarChart({ props }: any) {
  let subjectLables: string[] = []
  props[0][2].forEach((item: any) => {
    subjectLables.push(item.subject_name)
  })

  var eachSubjectPassMap: any = new Map()
  var eachSubjectFailMap: any = new Map()

  // each item is a list of subjects
  props.forEach((item: any) => {
    const subjectsList = item[2]
    subjectsList.forEach((subject: any) => {
      if (subject.grade_earned === 'Ab' || subject.grade_earned === 'F') {
        // check if key exists
        if (subject.subject_name in eachSubjectFailMap) {
          eachSubjectFailMap[subject.subject_name] += 1
        } else {
          eachSubjectFailMap[subject.subject_name] = 1
          eachSubjectPassMap[subject.subject_name] = 0
        }
      } else {
        if (subject.subject_name in eachSubjectPassMap) {
          eachSubjectPassMap[subject.subject_name] += 1
        } else {
          eachSubjectPassMap[subject.subject_name] = 1
          eachSubjectFailMap[subject.subject_name] = 0
        }
      }
    })
  })

  console.log(eachSubjectFailMap)
  console.log(eachSubjectPassMap)

  let eachSubjectPassPercentages: number[] = []
  let eachSubjectFailPercentages: number[] = []

  let total = props.length

  Object.entries(eachSubjectFailMap).forEach((item: any) => {
    eachSubjectFailPercentages.push(round((item[1]/total)*100, 2));
  })

  Object.entries(eachSubjectPassMap).forEach((item: any) => {
    eachSubjectPassPercentages.push(round((item[1]/total)*100, 2));
  })


  console.log(eachSubjectFailPercentages)
  console.log(eachSubjectPassPercentages)
  // eachSubjectFailMap.forEach((value: any, key: any, eachSubjectFailMap: any) => {
  //   console.log(value/ total);
  // })

  let data = {
    labels: subjectLables,
    datasets: [
      {
        label: 'Fail',
        data: eachSubjectFailPercentages, 
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Pass',
        data: eachSubjectPassPercentages, 
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        display: true,
      },
      title: {
        display: true,
        position: 'bottom' as const,
        text: 'Subject-wise Pass/Fail Percentage',
      },
    },
  }

  return <Bar options={options} data={data} width={400} height={300} />
}