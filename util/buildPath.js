import React from 'react'

const app_name = 'clockwork1'
export function buildPath(route) {
  if (process.env.NODE_ENV === 'production') {
    return 'https://' + app_name + '.herokuapp.com/' + route
  } else {
    return 'https://' + app_name + '.herokuapp.com/' + route
  }
}
