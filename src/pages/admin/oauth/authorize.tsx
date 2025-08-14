import { useGetAuthorizeLink } from "@common/admin.hooks"

export default function AuthorizePage() {
   const {data,isLoading,error} = useGetAuthorizeLink()
   return (
      <div>
         <h1>Not authenticated</h1>
         <p>Please authorize the application to access your account.</p>
         {isLoading && <p>Loading...</p>}
         {error && <p>Error: {error.message}</p>}
         {data && <a href={data}>Click to authorize</a>}
      </div>
   )
}
