import { useEffect, useState } from 'preact/hooks';
import { count, loadIndex, type Index } from './data';
import { usePath } from './router';
import { Shelves } from './shelves/Shelves';

export function App() {
  const path = usePath();
  const [index, setIndex] = useState<Index | null>(null);
  useEffect(() => void loadIndex().then(setIndex), []);

  const segs = path.split('/').filter(Boolean);
  const course = index?.courses.find((c) => c.id === segs[0]);
  const set = course?.sets.find((s) => s.id === segs[1]);
  useEffect(() => {
    document.title = set ? `${course!.title} · ${set.title} · codemax` : 'codemax';
  }, [set]);

  if (!index) return null;
  if (!segs.length) return <Shelves index={index} />;

  // The question pages are being rebuilt; until then a set page just says where you are.
  return (
    <main class="stub">
      <a href="/">← Shelves</a>
      {set ? (
        <>
          <h1>{course!.title} · {set.title}</h1>
          <p>{count(set.groups)} questions. This page is being rebuilt.</p>
        </>
      ) : <h1>Not found</h1>}
    </main>
  );
}
