import React, { useState } from "react";
import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";

const BOARD_SIZE = 8;
const EMPTY = null;
const BLACK = "black";
const WHITE = "white";

const initialBoard = Array(BOARD_SIZE)
  .fill()
  .map(() => Array(BOARD_SIZE).fill(EMPTY));
initialBoard[3][3] = WHITE;
initialBoard[3][4] = BLACK;
initialBoard[4][3] = BLACK;
initialBoard[4][4] = WHITE;

const Index = () => {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [gameOver, setGameOver] = useState(false);

  const placePiece = (row, col) => {
    if (gameOver || board[row][col] !== EMPTY) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    directions.forEach(([dx, dy]) => {
      let flipped = [];
      let r = row + dx;
      let c = col + dy;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] === getOpponent(currentPlayer)) {
        flipped.push([r, c]);
        r += dx;
        c += dy;
      }
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] === currentPlayer) {
        flipped.forEach(([fr, fc]) => {
          newBoard[fr][fc] = currentPlayer;
        });
      }
    });

    setBoard(newBoard);
    setCurrentPlayer(getOpponent(currentPlayer));
    checkGameOver(newBoard);
  };

  const getOpponent = (player) => {
    return player === BLACK ? WHITE : BLACK;
  };

  const checkGameOver = (board) => {
    if (board.every((row) => row.every((cell) => cell !== EMPTY))) {
      setGameOver(true);
    }
  };

  const getWinner = () => {
    const blackCount = board.flat().filter((cell) => cell === BLACK).length;
    const whiteCount = board.flat().filter((cell) => cell === WHITE).length;
    if (blackCount > whiteCount) return BLACK;
    if (whiteCount > blackCount) return WHITE;
    return null;
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Othello</Heading>
      <Grid templateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gap={1} mb={4}>
        {board.map((row, rowIdx) => row.map((cell, colIdx) => <Button key={`${rowIdx}-${colIdx}`} onClick={() => placePiece(rowIdx, colIdx)} borderRadius="50%" w="100%" h="100%" bg={cell === BLACK ? "black" : cell === WHITE ? "white" : "gray.100"} _hover={{ bg: "gray.200" }} disabled={gameOver} />))}
      </Grid>
      {gameOver ? <Text>Game Over! {getWinner() ? `${getWinner()} wins!` : "It's a tie!"}</Text> : <Text>Current Player: {currentPlayer}</Text>}
    </Box>
  );
};

export default Index;
