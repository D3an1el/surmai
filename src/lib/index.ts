export {
  authWithUsernameAndPassword, currentUser, logoutCurrentUser, createUserWithPassword, isAdmin
} from './pocketbase/auth'
export {
  getTrip,
  listTrips,
  createTrip,
  getAttachmentUrl,
  saveTransportationAttachments,
  addFlight,
  deleteTransportation,
  deleteTransportationAttachment,
  listTransportations,
  updateTrip,
  createTransportationEntry
} from './pocketbase/trips'


export const formatDate = (locale: string, input: Date) => {
  return input.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}