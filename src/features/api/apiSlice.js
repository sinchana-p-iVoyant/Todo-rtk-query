import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',         // default
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    tagTypes: ['Todos'],        // name the tag.
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: () => '/todos',        // anonymous function // '/todos' will be attached to the baseUrl
            // To sort the response in reverse order
            transformResponse: res => res.sort((a, b) => b.id - a.id),
            providesTags: ['Todos']       // say, it's providing this tag of todo's. 
        }),
        addTodo: builder.mutation({
            query: (todo) => ({         // "todo" is specified, coz it needs a new todo.
                url: '/todos',
                method: 'POST',
                body: todo
            }),
            invalidatesTags: ['Todos']      // invalidate the todo's cache.
        }),
        updateTodo: builder.mutation({
            query: (todo) => ({
                url: `/todos/${todo.id}`,
                method: 'PATCH',        // to update part of the record 
                body: todo
            }),
            invalidatesTags: ['Todos']
        }),
        deleteTodo: builder.mutation({
            query: ({ id }) => ({    // "({ id })": destructuring from todo
                url: `/todos/${id}`,
                method: 'DELETE',        // to update part of the record 
                body: id
            }),
            invalidatesTags: ['Todos']
        })
        
    })
    
})


export const {
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} = apiSlice

// Here we r using, json server with our local dev environment.
// So: baseUrl: 'http://localhost:3500'

// Feature on RTK-Query:
// It creates "custom hooks" based on the methods that we provide.


// Reason No CRUD operation in working:
// 1. Results get cached
// 2. we're not invalidating the previous cache
// 3. So it's not updating to show the new changes whether it's delete or update or add new-todo list.
// bcz, we r still seeing the cached version of the data.

// To FIX:
// 1. Assign a tag to the cache.
// 2. And let it know which mutations invalidate the cache
// 3. and so, it will automatically refetch the data for us.
// 