import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/credits/grs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/credits/grs"!</div>
}
