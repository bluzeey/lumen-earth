import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/credits/offset')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/credits/offset"!</div>
}
