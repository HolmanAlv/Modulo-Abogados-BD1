# Lista de funcionalidades a implementar:
## Pestaña “Caso”:
1. Todos los elementos deben estar deshabilitados con excepción del campo para introducir el nombre del Cliente.
2. Digitar un nombre y apellido de Cliente y al tocar la lupa debe buscarlo y traer el número de documento. Si no existe, con el botón crear se lanza una alerta para crear el cliente (La creación del Cliente no debes implementarla).
3. Al consultar el cliente, debe aparecer en "No. Caso" el último número de caso del cliente que no tiene fecha Fin, junto con los datos
correspondientes del caso, sin forma de modificarlos.
4. Si el "No. Caso" no corresponde al requerido (pues el cliente puede tener varios casos activos o sin fecha fin), se podrá encontrar con la lista desplegable y traer los datos correspondientes al seleccionado.
5. Si se selecciona un caso, solo se podrá consultar, mas no, se podrá actualizar.
6. Si es un caso nuevo, se podrá crear tocando el botón “crear” que se encuentra frente a No. Caso. Al tocar el botón crear, se genera un número de caso (un consecutivo a nivel funcional) y se habilitarán las demás casillas y se podrá seleccionar del calendario la fecha inicio, de la lista desplegable la especialización y digitar un valor.
7. Con el botón “Acuerdo Pago” se se lanza una alerta de acuerdo de pagos (No debes implementar el acuerdo pago).
8. La fecha Fin solo aparece únicamente hasta que se realiza el último pago (No se implementa), por lo que debe quedar siempre en NULL.


## Pestaña Expediente:
a. Si es un caso existente con fecha Fin, no se pueden actualizar los valores de expediente, pero se puede
navegar.
b. Si es un caso existente sin fecha Fin, se pueden actualizar los valores
c. Si es un caso nuevo, únicamente aparece el No, del caso y se habilita el botón “Crear”
d. Al presionar un botón Crear aparecen:
i. Un número de expediente (consecutivo) . No se puede modificar
ii. No. etapa en 1. No se puede modificar
iii. la fecha etapa la fecha del día. No se puede modificar
iv. El nombre de la etapa, la primera correspondiente a la especialización del caso. No se puede
modificar
v. De una lista desplegable que tiene los abogados con especialidad igual ala del caso, se puede
seleccionar uno.
vi. Ciudad, se puede seleccionar de una lista desplegable
vii. Aparece la lista de entidades que pertenecen a la Ciudad. Se puede seleccionar una.
viii. La Instancia queda en null, hasta que sea la etapa “Sentencia”, donde se debe colocar la
“Primera” en Instancia. Cuando sea la etapa de Impugnación se coloca “Segunda” en Instancia.
ix. En Impugnación queda en Null, hasta que sea la etapa “Impugnación” donde se habilita el botón
de seleccionar Impugnación (Aparecen únicamente las posibles impugnaciones de esa
Especialización y que se encuentran en la tabla “Especia-Etapa”
x. Suceso y Resultado son editores. Al dar doble click sobre ellos visualiza un documento donde se
puede escribir sin límite.
xi. En los botones de Documento, se pueden subir los documentos en PDF. Al dar Click sobre ellos,
se pueden visualizar.
xii. En el botón guardar, se puede guardar la etapa del expediente.