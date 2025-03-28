import { useEffect, useRef, useState, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';

const editorStyles = `
  .ql-container {
    background-color: rgb(33, 33, 52) !important;
    color: #ffffff !important;
    border: none;
  }
  .ql-editor::before {
    color: #a1a1b3 !important;
    font-style: normal;
  }
  .ql-toolbar.ql-snow {
    background-color: rgb(22, 22, 34) !important;
    border: none;
  }
  .ql-toolbar.ql-snow .ql-formats button,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label {
    color: #ffffff !important;
  }
  .ql-toolbar.ql-snow .ql-formats button:hover,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label:hover,
  .ql-toolbar.ql-snow .ql-formats .ql-picker-item:hover {
    color: #6b6bef !important;
  }
  .ql-snow .ql-picker-options {
    background-color: rgb(33, 33, 52) !important;
    color: #ffffff !important;
  }
`;

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const QuillEditor = ({ value: initialValue, onChange, maxLength }: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const [localValue, setLocalValue] = useState(initialValue);

  const debouncedOnChange = useCallback(
    debounce((content: string) => {
      onChange(content);
    }, 500),
    [onChange]
  );

  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = editorStyles;
      document.head.appendChild(styleSheet);

      // Реєструємо модуль keyboard для Quill
      const Keyboard = Quill.import('modules/keyboard');
      Quill.register('modules/keyboard', Keyboard, true);

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
          keyboard: {
            bindings: {
              // Перехоплюємо введення символів
              limitInput: {
                key: null, // Будь-яка клавіша
                handler: function (range: any, context: any) {
                  const text = quill.getText().replace(/\n/g, '');
                  if (maxLength && text.length >= maxLength) {
                    toast.warn(`Досягнуто ліміт у ${maxLength} символів!`, {
                      position: 'top-right',
                      autoClose: 2000,
                    });
                    return false; // Блокуємо введення
                  }
                  return true; // Дозволяємо введення
                },
              },
            },
          },
        },
        placeholder: `Введіть текст до ${maxLength} символів`,
      });

      quillInstanceRef.current = quill;

      if (localValue) {
        quill.root.innerHTML = localValue;
      }

      // Обробка змін тексту
      quill.on('text-change', (delta, oldDelta, source) => {
        const text = quill.getText().replace(/\n/g, '');
        const content = quill.root.innerHTML;

        if (maxLength && text.length > maxLength) {
          const limitedText = text.slice(0, maxLength);
          quill.setText(limitedText);
          setLocalValue(quill.root.innerHTML);
          debouncedOnChange(quill.root.innerHTML);
          toast.warn(`Досягнуто ліміт у ${maxLength} символів!`, {
            position: 'top-right',
            autoClose: 2000,
          });
        } else {
          setLocalValue(content);
          debouncedOnChange(content);
        }
      });

      return () => {
        document.head.removeChild(styleSheet);
        debouncedOnChange.cancel();
      };
    }
  }, [debouncedOnChange, maxLength]);

  useEffect(() => {
    if (
      quillInstanceRef.current &&
      initialValue !== quillInstanceRef.current.root.innerHTML &&
      initialValue !== localValue
    ) {
      const text = quillInstanceRef.current.getText().replace(/\n/g, '');
      if (maxLength && text.length > maxLength) {
        const limitedText = text.slice(0, maxLength);
        quillInstanceRef.current.setText(limitedText);
        setLocalValue(quillInstanceRef.current.root.innerHTML);
        toast.warn(`Вихідний текст скорочено до ${maxLength} символів!`, {
          position: 'top-right',
          autoClose: 2000,
        });
      } else {
        quillInstanceRef.current.root.innerHTML = initialValue;
        setLocalValue(initialValue);
      }
    }
  }, [initialValue, maxLength]);

  return (
    <div>
      <div ref={editorRef} style={{ minHeight: '150px' }} />
    </div>
  );
};

export default QuillEditor;
