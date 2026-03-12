Lee y sigue el archivo AGENTS.md de la raíz del proyecto como fuente principal de contexto funcional y reglas de negocio. A partir de ese documento, genera una primera versión completa y funcional de la aplicación, adaptándola a una implementación frontend con React.

Contexto y aclaración importante:
- La aplicación será solo frontend, sin backend ni base de datos.
- Debe desarrollarse como una app React limpia, mantenible y bien estructurada.
- Aunque AGENTS.md pueda mencionar HTML, CSS y JavaScript puros, en este proyecto quiero que la implementación final sea en React, manteniendo exactamente la misma lógica, comportamiento y separación de responsabilidades.
- La jornada ordinaria correcta no es de 8 horas, sino de 8,5 horas efectivas.
- El contexto real es:
  - horario de referencia: 08:00 a 17:00
  - pausa de comida habitual: 30 minutos
  - trabajo efectivo diario objetivo: 8 horas y 30 minutos
- Por tanto, los valores de negocio correctos son:
  - jornada objetivo: 510 minutos
  - flexibilidad máxima positiva: +60 minutos
  - flexibilidad máxima negativa: -60 minutos
  - máximo permitido sin horas extra: 570 minutos
  - mínimo permitido dentro del margen: 450 minutos

Objetivo de la app:
La aplicación debe permitir introducir los fichajes de un día y calcular:
1. tiempo efectivo trabajado
2. saldo respecto a la jornada objetivo de 8h 30m
3. hora exacta a la que se cumple la jornada
4. hora máxima de salida sin tener que registrar horas extra
5. resultado final del día cuando el usuario introduce la salida definitiva

Comportamiento funcional obligatorio:
- El usuario introduce fichajes en pares:
  - entrada
  - salida
  - entrada
  - salida
  - etc.
- Deben mostrarse inicialmente 2 pares de fichajes, que cubren el caso habitual:
  - entrada
  - salida a comer
  - vuelta al trabajo
  - salida final
- Debe existir un botón para añadir más pares de fichajes.
- Puede haber varias salidas y entradas intermedias durante el día.
- Debe permitirse que el último fichaje de salida esté vacío.

La app debe trabajar en dos modos:

1. Modo predictivo
Si el último fichaje de salida está vacío, la app debe calcular:
- tiempo trabajado acumulado en los tramos cerrados
- tiempo restante hasta completar la jornada de 8h 30m
- hora exacta en la que se cumpliría la jornada
- hora máxima de salida sin tener que registrar horas extra

2. Modo evaluación final
Si el último fichaje de salida sí está introducido, la app debe evaluar el resultado final y mostrar uno de estos escenarios:

A) Dentro del margen de flexibilidad
Condición:
- tiempo trabajado entre 7h 30m y 9h 30m
- es decir, entre 450 y 570 minutos
La app debe mostrar:
- tiempo total trabajado
- saldo respecto a 8h 30m
- mensaje claro indicando si ha acumulado flexibilidad, la ha perdido o ha cumplido exactamente la jornada

B) Fuera del margen por exceso positivo
Condición:
- tiempo trabajado > 570 minutos
La app debe mostrar:
- tiempo total trabajado
- saldo real
- mensaje claro indicando que debe registrar hora extra
- tiempo exacto de hora extra a introducir
Regla:
- la hora extra a introducir es todo lo que exceda de 570 minutos
Ejemplo:
- si trabaja 9h 42m, debe introducir 12 minutos de hora extra

C) Fuera del margen por defecto negativo
Condición:
- tiempo trabajado < 450 minutos
La app debe mostrar:
- tiempo total trabajado
- saldo real
- mensaje claro indicando que ha trabajado menos horas de las permitidas incluso considerando la flexibilidad
- tiempo exacto que falta para entrar dentro del margen permitido
Regla:
- el tiempo faltante se calcula respecto a 450 minutos

Validaciones obligatorias:
- cada campo debe aceptar una hora válida en formato HH:MM
- cada salida debe ser posterior a su entrada
- los fichajes deben estar en orden cronológico
- no debe haber tramos solapados
- no debe haber pares intermedios incompletos si después hay fichajes rellenos
- sí debe permitirse que solo el último tramo quede abierto
- si hay errores, deben mostrarse mensajes claros en pantalla

Ejemplo funcional que debe contemplarse:
- entrada: 08:20
- salida a comer: 13:31
- vuelta al trabajo: 14:05
- salida final vacía

Cálculo esperado:
- trabajo acumulado cerrado: 5h 11m
- tiempo restante hasta 8h 30m: 3h 19m
- hora para cumplir jornada: 17:24
- tiempo restante hasta 9h 30m: 4h 19m
- hora máxima de salida sin horas extra: 18:24

Requisitos técnicos:
- Implementa la app en React
- Mantén una estructura clara y mantenible
- Separa la lógica de negocio de la interfaz
- Trabaja internamente en minutos y convierte a HH:MM solo para mostrar resultados
- Usa componentes y utilidades bien organizados
- No metas toda la lógica en un único archivo
- No añadas backend, librerías innecesarias ni complejidad artificial
- La interfaz debe ser simple, clara y funcional

Estructura recomendada:
- componentes para formulario de fichajes y panel de resultados
- utilidades para parseo y formateo de horas
- módulo de validación
- módulo de cálculo de jornada/flexibilidad
- estilos limpios y sobrios

Resultados que deben mostrarse en UI:
- tiempo total trabajado
- jornada objetivo
- saldo diario
- estado del día
- hora para cumplir exactamente la jornada, cuando sea calculable
- hora máxima de salida sin horas extra, cuando sea calculable
- tiempo acumulado o perdido en flexibilidad, cuando corresponda
- tiempo exacto de hora extra a registrar, cuando proceda
- tiempo exacto faltante, cuando proceda

También quiero que:
- generes la estructura de archivos del proyecto
- implementes la primera versión completa de la app
- dejes el código listo para ejecutar
- uses textos de interfaz claros en español
- mantengas un diseño básico pero cuidado

Antes de escribir el código, resume brevemente cómo vas a estructurar la solución y qué archivos vas a crear. Después implementa toda la app.