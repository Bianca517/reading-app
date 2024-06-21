import React, { useEffect, useState } from 'react';
import { UserPositions, bookDTO, plannedBooks } from '../../types';

export default {
    CURRENT_READINGS: [] as bookDTO[],
    FINALIZED_READINGS: [] as bookDTO[],
    MONTH_PLANNED_BOOKS: {} as plannedBooks,
    USER_CURRENT_POSITIONS: {} as UserPositions, 
    CAN_SET_BOOK_TO_FINISHED: false as boolean,
}
