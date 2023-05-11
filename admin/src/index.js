const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")

const axios = require("axios")
const { createObjectCsvStringifier } = require("csv-writer")
const FormData = require("form-data");
const request = require("request")
const R = require("ramda")

const app = express()

app.use(bodyParser.json({limit: "10mb"}))

app.get("/investments/:id", (req, res) => {
  const {id} = req.params
  request.get(`${config.investmentsServiceUrl}/investments/${id}`, (e, r, investments) => {
    if (e) {
      console.error(e)
      res.send(500)
    } else {
      res.send(investments)
    }
  })
})

app.post("/investments/export", express.json(), async (req, res) => {
  let { data: companies } = await axios.get(`${config.companiesServiceUrl}/companies`)
  companies = R.indexBy(R.prop('id'), companies)

  const { data: investments } = await axios.get(`${config.investmentsServiceUrl}/investments`)

  const columns = [
    'User',
    'First Name',
    'Last Name',
    'Date',
    'Holding',
    'Value',
  ]

  const values = investments.map((i) => {
    return {
      'User': i.userId,
      'First Name': i.firstName,
      'Last Name': i.lastName,
      'Date': i.date,
      'Holding': R.join(', ', R.map((x) => companies[R.prop('id', x)].name, i.holdings)),
      'Value': R.sum(R.map((x) => i.investmentTotal * x.investmentPercentage, i.holdings))
    }
  })

  const csvBody = createObjectCsvStringifier({ header: columns }).stringifyRecords(values)
  const csvData = Buffer.from(`${columns.join(',')}\n${csvBody}`)

  // const formData = new FormData()
  // formData.append('file', csvData, {
  //   filename:    'investments.csv',
  //   contentType: 'application/octet-stream',
  // })

  const investmentResponse = await axios({
    method: 'post',
    url: `${config.investmentsServiceUrl}/investments/export`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      investments: csvData.toString()
    },
    // headers: formData.getHeaders(),
    // data: csvData,
  })

  res.send(investmentResponse.data)
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
