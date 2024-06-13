import React, { useEffect, useState } from 'react';
import { UserPositions, bookDTO, plannedBooks } from '../../types';

export default {
    CURRENT_READINGS: [] as bookDTO[],
    FINALIZED_READINGS: [] as bookDTO[],
    MONTH_PLANNED_BOOKS: {} as plannedBooks,
    USER_CURRENT_POSITIONS: {} as UserPositions, 
}
