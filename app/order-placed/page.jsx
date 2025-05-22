'use client'
import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import { useEffect } from 'react'

const OrderPlaced = () => {
  const { router } = useAppContext()

  useEffect(() => {
    if (router) {
      const timeout = setTimeout(() => {
        router.push('/my-orders')
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [router])

  return (
    <div className='h-screen flex flex-col justify-center items-center gap-5'>
      <div className="flex justify-center items-center relative">
        <Image className="absolute p-5" src={assets.checkmark} alt='Order Success' width={48} height={48} />
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200"></div>
      </div>
      <div className="text-center text-2xl font-semibold">Order Placed Successfully</div>
      <p className="text-gray-500">Redirecting to your orders in 5 seconds...</p>
    </div>
  )
}

export default OrderPlaced
