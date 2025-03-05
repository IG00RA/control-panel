import { useEffect, useRef, useState, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import debounce from 'lodash/debounce';

const editorStyles = `
  .ql-container {
    background-color: rgb(33, 33, 52) !important; /* Темний фон редактора */
    color: #ffffff !important; /* Колір тексту */
    border: none; /* Прибираємо стандартний бордер */
  }
  .ql-editor::before {
    color: #a1a1b3 !important; /* Колір плейсхолдера */
    font-style: normal; /* Прибираємо курсив, якщо потрібно */
  }
  .ql-toolbar.ql-snow {
    background-color: rgb(22, 22, 34) !important; /* Темний фон панелі інструментів */
    border: none; /* Прибираємо стандартний бордер */
  }
  .ql-toolbar.ql-snow .ql-formats button,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label {
    color: #ffffff !important; /* Колір елементів управління */
  }
  .ql-toolbar.ql-snow .ql-formats button:hover,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label:hover,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-item:hover {
    color: #6b6bef !important; /* Колір при наведенні */
  }
  .ql-snow .ql-picker-options {
    background-color: rgb(33, 33, 52)  !important; /* Темний фон випадаючого списку */
    color: #ffffff !important; /* Колір тексту в списку */
  }
`;

interface QuillEditorProps {
  value: string; // Вхідне значення як HTML-рядок
  onChange: (value: string) => void; // Callback для оновлення значення
}

const QuillEditor = ({ value: initialValue, onChange }: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const [localValue, setLocalValue] = useState(initialValue);

  // Дебонсінг для передачі змін у батьківський компонент
  const debouncedOnChange = useCallback(
    debounce((content: string) => {
      onChange(content);
    }, 500), // Затримка 500 мс
    [onChange]
  );

  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      // Додаємо власні стилі до документа
      const styleSheet = document.createElement('style');
      styleSheet.textContent = editorStyles;
      document.head.appendChild(styleSheet);

      // Ініціалізація Quill
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link'],
          ],
        },
        placeholder: 'Введіть текст...',
      });

      // Зберігаємо екземпляр Quill
      quillInstanceRef.current = quill;

      // Встановлюємо початкове значення
      if (localValue) {
        quill.root.innerHTML = localValue;
      }

      // Оновлюємо локальний стан і викликаємо дебонсінг при зміні вмісту
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        setLocalValue(content);
        debouncedOnChange(content);
      });

      // Очищення стилів і дебонсінгу при розмонтуванні
      return () => {
        document.head.removeChild(styleSheet);
        debouncedOnChange.cancel(); // Скасовуємо заплановані виклики дебонсінгу
      };
    }
  }, [debouncedOnChange]); // Залежність тільки від debouncedOnChange

  // Синхронізація з початковим значенням, якщо воно змінилося ззовні
  useEffect(() => {
    if (
      quillInstanceRef.current &&
      initialValue !== quillInstanceRef.current.root.innerHTML &&
      initialValue !== localValue
    ) {
      quillInstanceRef.current.root.innerHTML = initialValue;
      setLocalValue(initialValue);
    }
  }, [initialValue]);

  return (
    <div>
      <div ref={editorRef} style={{ minHeight: '150px' }} />
    </div>
  );
};

export default QuillEditor;
