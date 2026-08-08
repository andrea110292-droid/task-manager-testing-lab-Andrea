import { http, HttpResponse } from 'msw';

const API_URL = 'https://api.taskmanager-demo.invalid';

export const handlers = [
  http.post(`${API_URL}/tasks`, async ({ request }) => {
    const body = (await request.json()) as { title: string };
    return HttpResponse.json(
      { id: Date.now().toString(), title: body.title, status: 'pending' },
      { status: 201 }
    );
  }),

  http.get(`${API_URL}/tasks`, () => {
    return HttpResponse.json([
      { id: '1', title: 'Tarea existente', status: 'pending' },
      { id: '2', title: 'Otra tarea', status: 'completed' },
    ]);
  }),
];
