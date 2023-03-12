import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function GoBackButton({link}) {
  return (
      <Button variant="link">
          <Link to={link}>
              {'<- '}Go Back
          </Link>
      </Button>
  )
}

export default GoBackButton