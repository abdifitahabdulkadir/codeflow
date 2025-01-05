import { RouteParams } from '@/types/glabal'

export default async function QuestionDetailPage({ params }: RouteParams) {
  const { id } = await params
  return (
    <div>
      <h3>welcome to this questio detial {id}</h3>
    </div>
  )
}
