import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/credits/comply')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/credits/comply"!</div>
}
