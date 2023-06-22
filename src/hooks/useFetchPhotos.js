import React, { useEffect, useState } from 'react'

export default function useFetchPhotos() {
  const [ data, setData ] = useState(null)
  const API_URL = 'https://jsonplaceholder.typicode.com/photos'

  const fetchPhotos = async () => {
    const response = await fetch(API_URL)
    const photos = await response.json()
    setData(photos)
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  return ({
    data
  })
}