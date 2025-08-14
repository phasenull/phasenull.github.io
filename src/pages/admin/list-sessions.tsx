import { useGetSessions } from "@common/admin.hooks"

export default function ListSessionsPage() {
   const { data, isLoading, isError } = useGetSessions()
   return (
      <div>
         <h1>List of Sessions</h1>
         {isLoading && <p>Loading...</p>}
         {isError && <p>Error loading sessions</p>}
         {data && (
            <ul>
               {data.pages.reduce((acc, page) => [...acc, ...(page||[])], []).map((session) => (
                  <li key={session.id}>
                     <pre>{JSON.stringify(session,undefined,4)}</pre>
                  </li>
               ))}
            </ul>
         )}
      </div>
   )
}