import { useGetUsage } from "@common/admin.hooks";

export default function StatusPage() {
   const { data, isLoading, error } = useGetUsage()
   
   if (isLoading) return <div>Loading...</div>
   if (error) return <div>Error: {error.message}</div>

   return (
       <div>
           <h1>Status</h1>
           <pre>{JSON.stringify(data, null, 2)}</pre>
       </div>
   )
}