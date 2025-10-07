'use client'

import React from 'react'

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'table' | 'profile' | 'text'
  count?: number
  className?: string
}

export default function LoadingSkeleton({ 
  type = 'card', 
  count = 3,
  className = '' 
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  return (
    <div className={className}>
      {type === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletons.map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {type === 'list' && (
        <div className="space-y-4">
          {skeletons.map((i) => (
            <ListItemSkeleton key={i} />
          ))}
        </div>
      )}

      {type === 'table' && (
        <TableSkeleton rows={count} />
      )}

      {type === 'profile' && (
        <ProfileSkeleton />
      )}

      {type === 'text' && (
        <div className="space-y-3">
          {skeletons.map((i) => (
            <TextLineSkeleton key={i} width={i === count - 1 ? '60%' : '100%'} />
          ))}
        </div>
      )}
    </div>
  )
}

// Card skeleton
const CardSkeleton = () => (
  <div className="glass-card p-6 space-y-4 animate-pulse">
    <div className="w-full h-48 bg-surface rounded-xl" />
    <div className="space-y-2">
      <div className="h-6 bg-surface rounded-lg w-3/4" />
      <div className="h-4 bg-surface rounded-lg w-full" />
      <div className="h-4 bg-surface rounded-lg w-5/6" />
    </div>
    <div className="flex gap-2">
      <div className="h-10 bg-surface rounded-lg flex-1" />
      <div className="h-10 bg-surface rounded-lg flex-1" />
    </div>
  </div>
)

// List item skeleton
const ListItemSkeleton = () => (
  <div className="glass-card p-4 flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 bg-surface rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-5 bg-surface rounded-lg w-1/3" />
      <div className="h-4 bg-surface rounded-lg w-2/3" />
    </div>
    <div className="w-24 h-8 bg-surface rounded-lg flex-shrink-0" />
  </div>
)

// Table skeleton
const TableSkeleton = ({ rows = 5 }: { rows: number }) => (
  <div className="glass-card overflow-hidden">
    {/* Header */}
    <div className="p-4 border-b border-gray-800 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-5 bg-surface rounded-lg" />
        ))}
      </div>
    </div>

    {/* Rows */}
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="p-4 border-b border-gray-800 animate-pulse">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="h-5 bg-surface rounded-lg" />
          ))}
        </div>
      </div>
    ))}
  </div>
)

// Profile skeleton
const ProfileSkeleton = () => (
  <div className="space-y-6">
    {/* Avatar and name */}
    <div className="flex items-center gap-4 animate-pulse">
      <div className="w-24 h-24 bg-surface rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-8 bg-surface rounded-lg w-1/3" />
        <div className="h-5 bg-surface rounded-lg w-1/4" />
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card p-4 space-y-2 animate-pulse">
          <div className="h-8 bg-surface rounded-lg w-1/2" />
          <div className="h-4 bg-surface rounded-lg w-full" />
        </div>
      ))}
    </div>

    {/* Content */}
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-surface rounded-lg w-1/4" />
      <div className="space-y-2">
        <div className="h-4 bg-surface rounded-lg w-full" />
        <div className="h-4 bg-surface rounded-lg w-5/6" />
        <div className="h-4 bg-surface rounded-lg w-4/6" />
      </div>
    </div>
  </div>
)

// Text line skeleton
const TextLineSkeleton = ({ width = '100%' }: { width?: string }) => (
  <div 
    className="h-4 bg-surface rounded-lg animate-pulse"
    style={{ width }}
  />
)

// Spinner component for loading states
export const Spinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`
        ${sizeClasses[size]}
        border-accent/30 
        border-t-accent 
        rounded-full 
        animate-spin
      `} />
    </div>
  )
}

// Full page loading
export const FullPageLoading = ({ message = 'Завантаження...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Spinner size="lg" className="mb-4" />
    <p className="text-text-muted">{message}</p>
  </div>
)

// Inline loading
export const InlineLoading = ({ message = 'Завантаження...' }: { message?: string }) => (
  <div className="flex items-center justify-center gap-3 py-8">
    <Spinner size="sm" />
    <p className="text-sm text-text-muted">{message}</p>
  </div>
)
