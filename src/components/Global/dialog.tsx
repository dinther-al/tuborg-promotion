// import { Dialog, eventBus, useDialog } from 'personal-standard-ui-custom'
// import React from 'react'

// export const GlobalDialog = () => {
//   const dialogRef = React.useRef(null)

//   const { open, close } = useDialog(dialogRef)

//   const handleOpen = (data) => {
//     open(data)
//   }
//   const handleClose = () => {
//     close()
//   }

//   React.useEffect(() => {
//     eventBus.on('dialog', handleOpen)
//     eventBus.on('hide-dialog', handleClose)
//     return () => {
//       eventBus.off('dialog', handleOpen)
//       eventBus.off('hide-dialog', handleClose)
//     }
//   }, [])
//   return <Dialog ref={dialogRef} />
// }
